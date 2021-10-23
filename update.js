const log = require('./lib/log')('main');
const _ = require('lodash');
const fs = require('fs');
const ejs = require('ejs');
const crossoutDB = require('./lib/crossoutDB');

(async () => {
    const items = [];
    for (let {id} of await crossoutDB.getItems()) {
        const item = await crossoutDB.getItem(id);
        const margin =  item.sellPrice * 0.9 - item.craftPrice;
        items.push(Object.assign({}, item, {
            margin,
            marginPerMin: margin / item.craftTime,
        }));
    }
    const ejsTemplate = fs.readFileSync('report.ejs', 'utf8');
    fs.writeFileSync('report.html', ejs.render(ejsTemplate, {_, items}), 'utf8');
})();
