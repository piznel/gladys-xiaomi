const shared = require('./xiaomi.shared.js');
const Promise = require('bluebird');

module.exports = function createDevice(device) {
  var newDevice;
  switch (device.model) {
    case 'gateway':
      newDevice = {
        device: { name: 'Gateway', identifier: device.sid, protocol: 'zigbee', service: 'xiaomi-home' },
        types: [
          { identifier: 'light', type: 'binary', unit: '', min: 0, max: 1, sensor: false },
          { identifier: 'intensity', type: 'intensity', unit: '', min: 3, max: 100, sensor: false },
          { identifier: 'color', type: 'color', unit: '', min: 0, max: 16777215, sensor: false },
          { identifier: 'illumination', type: 'illumination', unit: 'lux', min: 300, max: 1300, sensor: true }
        ]
      };
      break;
    case 'switch':
      newDevice = {
        device: {
          name: 'Xiaomu button',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'switch', type: 'status', min: 0, max: 4, sensor: true }
        ]
      };
      break
    case 'motion_sensor':
      newDevice = {
        device: {
          name: 'Xiaomi Motion sensor',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'binary', type: 'binary', min: 0, max: 1, sensor: true },
          { identifier: 'lastmotion', type: 'minutes', min: 0, max: 1800, sensor: true }
        ]
      };
      break
    case 'temp_sensor':
      newDevice = {
        device: {
          name: 'Xiaomi Temperature & Humidity',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'temperature', type: 'temperature', unit: '°C', min: -100, max: 100, sensor: true },
          { identifier: 'humidity', type: 'humidity', unit: '%', min: 0, max: 100, sensor: true }
        ]
      };
      break
    case 'cube':
      newDevice = {
        device: {
          name: 'Xiaomi Magic Cube',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'cube', type: 'status', min: 0, max: 8, sensor: true },
          { identifier: 'rotate', type: 'rotate', min: -100, max: 100, sensor: true },
          { identifier: 'speed', type: 'speed', min: 0, max: 1000, sensor: true }
        ]
      };
      break
    case 'weather':
      newDevice = {
        device: {
          name: 'Xiaomi Temperature & Humidity & Pressure',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'temperature', type: 'temperature', unit: '°C', min: -100, max: 100, sensor: true },
          { identifier: 'humidity', type: 'humidity', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'pressure', type: 'pressure', unit: 'Pa', min: 3000, max: 11000, sensor: true }
        ]
      };
      break
    case 'magnet':
      newDevice = {
        device: {
          name: 'Xiaomi Door & Window',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'magnet', type: 'status', min: -1, max: 1, sensor: true },
        ]
      };
      break
    case 'motion_sensor_aqara':
      newDevice = {
        device: {
          name: 'Xiaomi Motion sensor Aqara',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'binary', type: 'binary', min: 0, max: 1, sensor: true },
          { identifier: 'lastmotion', type: 'minutes', unit: 'min', min: 0, max: 5, sensor: true },
          { identifier: 'illumination', type: 'illumination', unit: 'lux', min: 0, max: 1200, sensor: true }
        ]
      };
      break
    case 'plug':
      newDevice = {
        device: {
          name: 'Xiaomi Plug',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'binary', type: 'binary', min: 0, max: 1, sensor: false },
          { identifier: 'instantaneous_power', type: 'power', unit: 'watt', min: 0, max: 2200, sensor: true },
          { identifier: 'total_power', type: 'totalpower', unit: 'w/h', min: 0, max: 999999, sensor: true },
          { identifier: 'inuse', type: 'binary', min: 0, max: 1, sensor: true }
        ]
      };
      break
    case 'leak':
      newDevice = {
        device: {
          name: 'leak',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'leak', type: 'status', min: 0, max: 1, sensor: true }
        ]
      };
      break;
    case 'smoke':
      newDevice = {
        device: {
          name: 'Xiaomi smoke',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'alarm', type: 'status', min: 0, max: 32768, sensor: true },
          { identifier: 'density', type: 'density', min: 0, max: 100, sensor: true }
        ]
      };
      break
    case 'vibration':
      newDevice = {
        device: {
          name: 'Xiaomi vibration',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true },
          { identifier: 'vibration', type: 'status', min: 0, max: 3, sensor: true },
          { identifier: 'tilt_angle', type: 'angle', unit: '°', min: 0, max: 3, sensor: true },
          { identifier: 'acceleration_X', type: 'acceleration', unit: 'mg', min: -8000, max: 8000, sensor: true },
          { identifier: 'acceleration_Y', type: 'acceleration', unit: 'mg', min: -8000, max: 8000, sensor: true },
          { identifier: 'acceleration_Z', type: 'acceleration', unit: 'mg', min: -8000, max: 8000, sensor: true },
          { identifier: 'upper_face', type: 'side', min: 0, max: 6, sensor: true },
          { identifier: 'bed_activity', type: 'activity', min: -8000, max: 8000, sensor: true }
        ]
      };
      break
    case 'Single_Wired_Switch':
      newDevice = {
        device: {
          name: 'Xiaomi Single Wired Switch',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'Channel_0', type: 'binary', min: 0, max: 1, sensor: false }
        ]
      };
      break
    case 'Duplex_Wired_Switch':
      newDevice = {
        device: {
          name: 'Xiaomi Duplex Wired Switch',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { name: 'Button 1', identifier: 'Channel_0', type: 'binary', min: 0, max: 1, sensor: false },
          { name: 'Button 2', identifier: 'Channel_1', type: 'binary', min: 0, max: 1, sensor: false }
        ]
      };
      break
    case 'Single_Wired_Switch_N':
      newDevice = {
        device: {
          name: 'Xiaomi Single Wired Switch Neutral',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { identifier: 'Channel_0', type: 'binary', min: -1, max: 1, sensor: false }
        ]
      };
      break
    case 'Duplex_Wired_Switch_N':
      newDevice = {
        device: {
          name: 'Xiaomi Duplex Wired Switch Neutral',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { name: 'Button 1', identifier: 'Channel_0', type: 'binary', min: -1, max: 1, sensor: false },
          { name: 'Button 2', identifier: 'Channel_1', type: 'binary', min: -1, max: 1, sensor: false }
        ]
      };
      break
    case 'Duplex_Wireless_Switch':
      newDevice = {
        device: {
          name: 'Xiaomi Duplex Wireless Switch',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { name: 'Button 1', identifier: 'Channel_0', type: 'binary', min: -1, max: 1, sensor: false },
          { name: 'Button 2', identifier: 'Channel_1', type: 'binary', min: -1, max: 1, sensor: false },
          { name: 'both button', identifier: 'dual_channel', type: 'binary', min: -1, max: 1, sensor: false },
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true }
        ]
      };
      break
    case 'Single_Wireless_Switch':
      newDevice = {
        device: {
          name: 'Xiaomi Single Wireless Switch',
          identifier: device.sid,
          protocol: 'zigbee',
          service: 'xiaomi-home'
        },
        types: [
          { name: 'Button 1', identifier: 'Channel_0', type: 'binary', min: -1, max: 1, sensor: false },
          { identifier: 'battery', type: 'battery', unit: '%', min: 0, max: 100, sensor: true }
        ]
      };
      break
    default:
      sails.log.debug('Xiaomi module : ' + device.model + ' => device not supported');
      if (!shared.unknownDevice.has(device.sid)) shared.unknownDevice.set(device.sid, device)
  }
  if (newDevice) {

    // *********DEBUG START*******************
    if (shared.debug === 4 || shared.debug === 10) sails.log.debug('Xiaomi createDevice.newDevice :', newDevice)
    // *********DEBUG END*******************

    gladys.device.create(newDevice)
      .then((data) => {

        // *********DEBUG START*******************
        if (shared.debug === 4 || shared.debug === 10) sails.log.debug('Xiaomi createDevice.gladys :', data.device.name + ', id :' + data.device.identifier)
        // *********DEBUG END*******************

        return Promise.resolve(device);
      })
      .catch((err) => {
        return Promise.reject('Xiaomi module : impossible to create device ' + newDevice);
      });
  }
  return Promise.resolve(device);
}