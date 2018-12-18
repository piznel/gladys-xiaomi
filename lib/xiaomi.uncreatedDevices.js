var shared = require('./xiaomi.shared.js');
var Promise = require('bluebird');

module.exports = function setup() {
  if (shared.errorDevices.size === 0) return Promise.resolve();

  return mapToJson(shared.errorDevices)
    .then((devices) => {
      return Promise.resolve(devices)
    })
    .catch(() => {
      return Promise.reject()
    });
}

function mapToJson(devices) {
  let obj = []
  for (let [sid, device] of devices) {
    obj.push({ sid: sid, model: devices.model })
  }
  return Promise.all(obj).then((obj) => {
    return Promise.resolve(obj)
  })
}