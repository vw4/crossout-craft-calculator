const axios = require('axios');
const log = require('./log')('http');

axios.interceptors.request.use(function (config) {
    log(`${config.method} ${config.url}`);
    return config;
}, function (error) {
    return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
    log(`${response.status} ${response.statusText}`);
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

module.exports = axios;
