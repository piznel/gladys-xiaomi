var shared = require('./xiaomi.shared.js');
const Promise = require('bluebird');

module.exports = function exec(params) {
  if (shared.gateways.has(params.deviceType.identifier)) {
    // it's for gateway
    return gladys.deviceType.getByDevice({ id: params.deviceType.device })
      .then((types) => {
        // load current colors & state
        var color = 0;
        var intensity = 0;
        var onoff = 0;
        for (var type of types) {
          switch (type.type) {
            case 'intensity':
              intensity = type.lastValue === 0 ? 100 : type.lastValue;
              break;
            case 'color':
              color = type.lastValue === 0 ? 16777215 : type.lastValue;
              break;
            case 'binary':
              onoff = type.lastValue;
              break;
          }
        }

        // set color if the device is turn on, or if it will be
        // update color to set with the new value
        if (params.deviceType.type === 'binary' || onoff === 1) {
          switch (params.deviceType.type) {
            case 'intensity':
              intensity = params.state.value === 0 ? 100 : params.state.value;
              break;
            case 'color':
              color = params.state.value === 0 ? 16777215 : params.state.value;
              break;
            case 'binary':
              if (!params.state.value) {
                intensity = 0;
                color = 0;
              }
              break;
          }
          return Promise.resolve(shared.xiaomi.setColor(color, intensity, params.deviceType.identifier));
        }
      })
      .catch((err) => {
        return Promise.reject(new Error(err));
      });
  } else {
    // it isn't a gateway !
    return Promise.resolve(shared.xiaomi.deviceTurnOff(params.deviceType, params.state))

  }

}