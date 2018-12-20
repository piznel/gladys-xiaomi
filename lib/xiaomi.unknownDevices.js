var shared = require('./xiaomi.shared.js');
var Promise = require('bluebird');

module.exports = function setup() {
  if (shared.unknownDevices.size === 0) return Promise.resolve();

  return mapToJson(shared.unknownDevices)
    .then((devices) => {

        // *********DEBUG START*******************
        if (shared.debug === 10) sails.log.debug('Xiaomi shared.unknownDevices :', devices)
        // *********DEBUG END******************* 
      
      return Promise.resolve(devices)
    })
    .catch(() => {
      return Promise.reject()
    });
}

function mapToJson(devices) {
  let obj = []
  for (let [sid, device] of devices) {
    obj.push({ sid: sid, model: device.model })
  }
  return Promise.all(obj).then((obj) => {
    return Promise.resolve(obj)
  })
}