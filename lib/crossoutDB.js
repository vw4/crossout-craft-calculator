const _ = require('lodash');
const http = require('./http');
const log = require('./log')('items');

let items = new Map();

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

async function getItems() {
    const response = await http.get('https://crossoutdb.com/api/v1/items');
    return _.orderBy(_.filter(response, {craftable: 1, removed: 0}), 'craftingMargin', 'desc');
}

async function getItem(id) {
    if (items.has(id)) {
        return items.get(id);
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
        items.set(id, item);
        return item;
    }
    let craftingBuySum = 0;
    let craftingTime = 0;
    for (let ingredient of ingredients) {
        const {item} = ingredient;
        let subItem = await getItem(item.id);
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

    items.set(id, item);
    return item;
}

module.exports = {
    getItems,
    getItem,
};
