const log = require('./lib/log')('main');
const _ = require('lodash');
const fs = require('fs');
const ejs = require('ejs');
const crossoutDB = require('./lib/crossoutDB');
const yargs = require('yargs/yargs');

(async () => {
    const argv = yargs(process.argv).argv;
    const factions = _.compact(_.map((argv.factions || '').split(','), s => s.trim()));
    let catalog = await crossoutDB.getItems();
    if (factions.length) {
        catalog = _.filter(catalog, ({faction}) => factions.includes(faction));
    }
    const items = [];
    for (let {id} of catalog) {
        const item = await crossoutDB.getItem(id);
        const margin =  item.sellPrice * 0.9 - item.craftPrice;
        items.push(Object.assign({}, item, {
            margin,
            marginPerMin: margin / item.craftTime,
        }));
    }
    const ejsTemplate = fs.readFileSync('./report/template.ejs', 'utf8');
    fs.writeFileSync('./report/index.html', ejs.render(ejsTemplate, {_, items}), 'utf8');
})();
