var shared = require('./xiaomi.shared.js');
var Promise = require('bluebird');

module.exports = function setup() {
  if (shared.gateways.size === 0) return Promise.resolve();

  return mapToJson(shared.gateways)
    .then((gateways) => {

      // *********DEBUG START*******************
      if (shared.debug === 10) sails.log.debug('Xiaomi shared.gateways :', gateways)
      // *********DEBUG END******************* 
            
      return Promise.resolve(gateways)
    })
    .catch(() => {
      return Promise.reject()
    });
}

function mapToJson(gateways) {
  let obj = []
  for (let [sid, gateway] of gateways) {
    obj.push({ sid: sid, ip: gateway.ip, password: gateway._password, validkey: gateway._validKey })
  }
  return Promise.all(obj).then((obj) => {
    return Promise.resolve(obj)
  })
}