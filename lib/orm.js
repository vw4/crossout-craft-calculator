const { Sequelize, Model, DataTypes, Op } = require('sequelize');
const moment = require('moment');
const sequelize = new Sequelize('sqlite:crossout.sqlite3', {logging: require('./log')('orm')});

class Item extends Model {}
Item.init({
    id: {type: DataTypes.NUMBER, primaryKey: true},
    name: DataTypes.STRING,
    rarity: DataTypes.STRING,
    category: DataTypes.STRING,
    faction: DataTypes.STRING,
    craftOrBuy: DataTypes.STRING,
    craftPrice: DataTypes.NUMBER,
    buyPrice: DataTypes.NUMBER,
    sellPrice: DataTypes.NUMBER,
    craftTime: DataTypes.NUMBER,
}, { sequelize, modelName: 'item' });

module.exports = async () => {
    await sequelize.sync();
    return {
        getItem: async (id) => {
            return await Item.findOne({
                where: {
                    id,
                    updatedAt: {
                        [Op.gte]: moment().subtract(15, 'minutes').toDate()
                    }
                }
            }, {sequelize});
        },
        setItem: async (item) => {
            await Item
                .findOne({ where: {id: item.id} })
                .then(existingItem => {
                    if (existingItem) {
                        return existingItem.update(item);
                    }
                    return Item.create(item);
                });
        },
    }
};