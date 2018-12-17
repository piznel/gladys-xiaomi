/* daemon to listen messages sent by the gateway */
const shared = require('./shared.js');
const Xiaomi = require('./xiaomi.js');
const createDevice = require('./createDevice.js');
const createDeviceState = require('./createDeviceState.js');
const Promise = require('bluebird');

module.exports = function listen() {

  gladys.param.getValue('Xiaomi_debug')
  .then((debug) => {
    shared.debug = debug;
    return gladys.param.getValue('Xiaomi_debugDevice')
  })
  .then((debugDevice) => {
    shared.debugDevice = debugDevice;
  })
  .catch(() => {})
  .then(() => {
    return gladys.param.getValue('Xiaomi_password')
      .then((password) => {
        shared.password = password.split(',');
        shared.xiaomi = new Xiaomi();
        shared.xiaomi.on('ready', () => {
          return shared.xiaomi.getDetails()
            .then((devices) => {
              return Promise.each(devices.values(), device => {
                return createDevice(device)
                  .then((device) => {
                    return createDeviceState(device);
                  })
                  .catch((err) => {
                    return sails.log.error(err)
                  })
              })
            });
        });

        shared.xiaomi.on('event', (data) => {
          return createDevice(data)
            .then((data) => {
              return createDeviceState(data);
            });
        });
      })
  })
  .catch(() => {
    sails.log.error("Xiaomi Module : Specify the gateway password(s) in Gladys' Xiaomi_password parameter, separated by a comma");
  });


}