const http = require('./lib/http');
const log = require('./lib/log')('main');
const _ = require('lodash');
const Items = require('./lib/items');

(async () => {
    const items = await Items();
    const response = await http.get('https://crossoutdb.com/api/v1/items');
    const crossoutItems = _.orderBy(_.filter(response, {craftable: 1, removed: 0}), 'craftingMargin', 'desc');
    for (let item of crossoutItems) {
        const result = await items.getItem(item.id);
    }
})();
