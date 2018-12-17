var shared = require('./xiaomi.shared.js');
var Promise = require('bluebird');

module.exports = function setup(){
    if (shared.errorDevices.size === 0) return Promise.resolve('No multiple device!');

    return Promise.resolve(shared.errorDevices)
}