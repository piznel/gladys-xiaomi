var shared = require('./xiaomi.shared.js');
var Promise = require('bluebird');

module.exports = function setup(){
    if (shared.gateways.size === 0) return Promise.reject(new Error('No gateway found!'));

    return Promise.resolve(shared.gateways)
}