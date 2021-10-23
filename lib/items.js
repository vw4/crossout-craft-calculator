const _ = require('lodash');
const Orm = require('./orm');
const http = require('./http');
const log = require('./log')('items');

let orm; // мне стыдно за глобальные переменные (нет)

const timeToRarity = {
    'Common': 0,
    'Rare': 15,
    'Special': 60,
    'Epic': 6 * 60,
    'Legendary': 21 * 60,
    'Relic': 5 * 24 * 60,
}

function getCraftingTimeByRarity(rarityName) {
    return timeToRarity[rarityName];
}

async function getItemFromCrossout(id) {
    let dbItem = await orm.getItem(id);
    if (dbItem) {
        return dbItem;
    }
    const {recipe} = await http.get(`https://crossoutdb.com/api/v1/recipe/${id}`);
    const {ingredients, item: {craftingResultAmount, buyPrice, sellPrice}} = recipe;
    const item = {
        id: recipe.item.id,
        name: recipe.item.name,
        rarity: recipe.item.rarityName,
        category: recipe.item.categoryName,
        faction: recipe.item.faction,
        id: recipe.item.id,
        buyPrice,
        sellPrice,
        craftOrBuy: 'Buy',
    }
    if (ingredients.length === 0) {
        await orm.setItem(item);
        return item;
    }
    let craftingBuySum = 0;
    let craftingTime = 0;
    for (let ingredient of ingredients) {
        const {item} = ingredient;
        let subItem = await getItemFromCrossout(item.id);
        if (subItem.craftOrBuy === 'Craft') {
            craftingBuySum += subItem.craftPrice * ingredient.number / item.amount;
            craftingTime += subItem.craftTime *  _.ceil(ingredient.number / item.amount);
        } else {
            if (item.amount === 0) {
                craftingBuySum += subItem.buyPrice * ingredient.number;
            } else {
                craftingBuySum += subItem.buyPrice * ingredient.number / item.amount;
            }
        }
    }
    item.craftPrice = craftingBuySum / craftingResultAmount;
    item.craftTime = (getCraftingTimeByRarity(item.rarity) + craftingTime) / craftingResultAmount;
    if (item.craftPrice < buyPrice) {
         item.craftOrBuy = 'Craft';
    }

    await orm.setItem(item);
    return item;
}

module.exports = async () => {
    orm = await Orm();
    return {
        getItem: getItemFromCrossout
    }
};