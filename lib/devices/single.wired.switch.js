const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const SWITCH_STATUS = {
    on: 1,
    off: 0,
    unknow: -1
};

module.exports = class SingleWiredSwitch extends GenericDevice {
    constructor(sid, ip) {
        super(sid, 'SingleWiredSwitch');
        this.Channel_0 = null; // 0 or 1
        this.ip = ip
    }

    deviceMessage(message) {

        if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
            let data = JSON.parse(message.data);
            var eventdata = {};
            eventdata.sid = this.sid;
            eventdata.model = this.model;

            if (data.Channel_0) {
                this.Channel_0 = SWITCH_STATUS[data.Channel_0];
                eventdata.Channel_0 = this.Channel_0;
            }
            return Promise.resolve({ msg: 'event', data: eventdata });
        }
        return Promise.resolve('success');
    }

    deviceExec(deviceType, state) {
        if (deviceType.identifier === this.sid) {
            if ( typeof(state) !== 'undefined' && state.value !== null) {
                this.Channel_0 = state.value
                let value = state.value === 1 ? 'on' : 'off';
                const msg = `\\"Channel_0\\":\\"${value}\\"`;
                return Promise.resolve(msg)
            } else {
                return Promise.reject(`Xiomi Module : invalid status for wired switch identifier whose identifier is "${this.sid}"`)
            }
        } else {
            return Promise.reject(`Xiomi Module : the sid "${this.sid}" is not that of a wired switch.`)
        }
    }
}