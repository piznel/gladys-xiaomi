var shared = require('./xiaomi.shared.js');
var Promise = require('bluebird');

module.exports = function setup(){
    if (shared.unknownDevices.size === 0) return Promise.resolve('No unknow device!');

    return Promise.resolve(shared.unknownDevices)
}