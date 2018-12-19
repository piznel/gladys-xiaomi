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
            shared.xiaomi.on('event', (device) => {
              return createOne(device)
            });
          })
      });

    })
    //.catch((err) => {
    //  sails.log.error(err)
    //});
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
}

function getParameters() {
  return Promise.all([
    getDebugMode().catch(() => { return sails.log('Xiaomi module: debug mode inactive!') }),
    getDebugDevice().catch(() => { return sails.log('Xiaomi module: debug device mode inactive!') }),
    getPassword().catch(() => { return sails.log('Xiaomi module: No registered gateway password!') })
  ])
}

function getDebugMode() {
  return gladys.param.getValue('Xiaomi_debug')
    .then((debug) => {
      shared.debug = parseInt(debug);
      sails.log(`Xiaomi module : debug mode '${debug}' active!`)
      return Promise.resolve()
    })

}

function getDebugDevice() {
  return gladys.param.getValue('Xiaomi_debugDevice')
    .then((debugDevice) => {
    shared.debugDevice = debugDevice;
    sails.log(`Xiaomi module: debug device '${debugDevice}' mode active!`)
    return Promise.resolve()
    })

}

function getPassword() {
  return gladys.param.getValue('Xiaomi_password')
    .then((passwords) => {
      return saveInMemory(JSON.parse(passwords))
    })

}


  