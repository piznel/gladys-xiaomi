const shared = require('./xiaomi.shared.js');
const Promise = require('bluebird');

const SWITCH_STATUS = {
    no_click:0,
    click: 1,
    double_click: 2,
    long_click_press: 3,
    long_click_release: 4
};

const MOTION_STATUS = {
    motion: 1,
    no_motion: 0
};

const CUBE_STATUS = {
    sleep: 0,
    alert: 1,
    tap_twice: 2,
    flip90: 3,
    flip180: 4,
    rotate: 5,
    shake_air: 6,
    move: 7,
    free_fall: 8
};

const MAGNET_STATUS = {
    open: 1,
    close: 0,
    unknow: -1
};

const PLUG_STATUS = {
    on:1,
    off:0
};

const LEAK_STATUS = {
    leak:1,
    no_leak:0
};

const VIBRATION_STATUS = {
    sleep:0,
    vibrate:1,
    tilt:2,
    free_fall:3
}

module.exports = function createDeviceState(device) {
    for (let _attribute in device) {
        let _devicetype;
        let _value;
        switch (_attribute) {
            case 'lastStatus':
                switch (device.model) {
                    case 'switch':
                        _devicetype = 'switch';
                        _value = SWITCH_STATUS[device[_attribute]];
                        break;
                    case 'motion_sensor_aqara':
                    case 'motion_sensor':
                        _devicetype = 'motion';
                        _value = MOTION_STATUS[device[_attribute]];
                        break;
                    case 'cube':
                        _devicetype = 'cube';
                        _value = CUBE_STATUS[device[_attribute]];
                        break;
                    case 'magnet' :
                        _devicetype = 'magnet';
                        _value = MAGNET_STATUS[device[_attribute]];
                        break;
                    case 'plug' :
                        _devicetype = 'plug';
                        _value = PLUG_STATUS[device[_attribute]];
                        break;
                    case 'leak' :
                        _devicetype = 'leak';
                        _value = LEAK_STATUS[device[_attribute]];
                        break;
                    case 'vibration' :
                        _devicetype = 'vibration';
                        _value = VIBRATION_STATUS[device[_attribute]];
                        break;
                }
                break;

            case 'light':               // gateway
            case 'illumination':        // gateway
            case 'temperature':         // temperature sensor, weather sensor
            case 'humidity':            // temperature sensor, weather sensor
            case 'battery':             // switch, motion sensor, temperature sensor, cube, weather sensor, magnet, motion sensor aqara, leak, smoke, vibration
            case 'pressure':            // weather sensor
            case 'density':             // smoke
            case 'speed' :              // cube
            case 'total_power':         // plug
            case 'instantaneous_power': // plus
            case 'lastmotion':          // motion sensor, motion sensor aqara
            case 'rotate':              // cube
            case 'inuse':               // plug
            case 'alarm':               // smoke
            case 'acceleration_X':      // vibration
            case 'acceleration_Y':      // vibration
            case 'acceleration_Z':      // vibration
            case 'tilt_angle':          // vibration
            case 'upper_face':          // vibration
            case 'bed_activity':        // vibration
            case 'Channel_0':           // wired single and duplex switch, wireless single and duplex switch 
            case 'Channel_1':           // wired duplex switch, wireless duplex switch
            case 'dual_channel':        // wireless duplex switch
                _devicetype = _attribute;
                _value = device[_attribute];
                break;
            case 'color':               // gateway
                // if intensity is 0, don't change values
                _devicetype = _attribute;
                _value = device.intensity === 0 ? null : device[_attribute];
                break;            
            case 'intensity':           // gateway
                _devicetype = _attribute;
                _value = device[_attribute] === 0 ? null : device[_attribute];
                createDeviceState({ sid: device.sid, model: device.model, light: _value ? 1 : 0 });
                break;
        }

        // *********DEBUG START*******************
        if (shared.debug === 5) sails.log('Xiaomi createDeviceState :'+ device.model + ' ' + device.sid + ', _devicetype = ' + _devicetype + ', value = ' + device[_attribute] + ', _value = ' + _value);
        // *********DEBUG END*******************

        if (_value || _value === 0) {
            gladys.deviceType.getByIdentifier({ deviceIdentifier: device.sid, deviceService: 'xiaomi-home', deviceTypeIdentifier: _devicetype })
                .then((deviceType) => {
                    gladys.deviceState.create({ devicetype: deviceType.id, value: _value })
                        .then(() => {
                            return Promise.resolve(deviceType);
                        })
                        .catch((err) => {
                            return Promise.reject(new Error(err));
                        });
                })
                .catch((err) => {
                    return Promise.reject('Xiaomi module : device not found');
                });
        }
    }
    return Promise.resolve(device);
}