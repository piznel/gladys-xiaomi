/* daemon to listen messages sent by the gateway */
const shared = require('./xiaomi.shared.js');
const Xiaomi = require('./xiaomi.xiaomi.js');
const createDevice = require('./xiaomi.createDevice.js');
const createDeviceState = require('./xiaomi.createDeviceState.js');
const Promise = require('bluebird');

module.exports = function listen() {
  return getParameters()
    .then(() => {
      shared.xiaomi = new Xiaomi();
      shared.xiaomi.on('ready', () => {
        return shared.xiaomi.getDetails()
          .then((devices) => {
            return createAll(devices)
          })
          .catch((err) => {
            sails.log.error(err)
          })
          .then(() => {
            gladys.socket.emit('xiaomi_ready', true)
          })
      });
      shared.xiaomi.on('event', (device) => {
        return createOne(device)
      });
    })
    .catch((err) => {
      sails.log.error(err)
    });
}

function saveInMemory(passwords) {
  return Promise.map(passwords, (gateway) => {
    return Promise.resolve(shared.passwords.set(gateway.sid, gateway.password))
  })
}

function createAll(devices) {
  return Promise.each(devices.values(), device => {
    return createOne(device)
  })
}

function createOne(device) {
  return createDevice(device)
    .then((device) => {
      return createDeviceState(device);
    })
    .catch((err) => {
      return sails.log.error(err)
    })
}

function getParameters() {
  return getDebugMode()
  .then(() => {
    return getDebugDevice()
  })
  .then(() => {
    return getPassword()
  })
  .then(() => {
    return Promise.resolve()
  })
  .catch(() => {
    return Promise.resolve()
  })
}


function getDebugMode() {
  return gladys.param.getValue('Xiaomi_debug')
      .then((debug) => {
        shared.debug = debug;
        return Promise.resolve()
      })
      .catch(() => {
        sails.log('Xiaomi module : debug mode disabled')
        return Promise.resolve()
    }) 
}

function getDebugDevice() {
  return gladys.param.getValue('Xiaomi_debugDevice')
    .then((debugDevice) => {
    shared.debugDevice = debugDevice;
    return Promise.resolve()
    })
    .catch(() => {
      sails.log('Xiaomi module : debug device mode disabled')
      return Promise.resolve()
    })
}

function getPassword() {
  return gladys.param.getValue('Xiaomi_password')
    .then((passwords) => {
      return saveInMemory(JSON.parse(passwords))
    })
    .catch(() => {
      sails.log("Xiaomi module : Specify the gateway password(s) in Gladys's Xiaomi module parameter");
      return Promise.resolve()
    })
}


  