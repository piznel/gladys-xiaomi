const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const SWITCH_STATUS = {
    on: 1,
    off: 0,
    unknow: -1
};

module.exports = class DuplexWiredSwitchLN extends GenericDevice {
    constructor(sid, ip, modelX) {
        super(sid, ip, 'Duplex_Wired_Switch_N', modelX);
        this.lastChannel_0 = null; // -1, 0 or 1
        this.lastChannel_1 = null; // -1, 0 or 1
    }

    deviceMessage(message) {

        if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
            let data = JSON.parse(message.data);
            var eventdata = {};
            eventdata.sid = this.sid;
            eventdata.model = this.model;

            if (data.channel_0) {
                this.lastChannel_0 = SWITCH_STATUS[data.channel_0];
                eventdata.lastChannel_0 = this.lastChannel_0;
            }

            if (data.channel_1) {
                this.lastChannel_1 = SWITCH_STATUS[data.channel_1];
                eventdata.lastChannel_1 = this.lastChannel_1;
            }

            return Promise.resolve({ msg: 'event', data: eventdata });
        }
        return Promise.resolve('success');
    }

    deviceExec(deviceType, state) {
        if (deviceType.identifier === this.sid) {
            let msg = '';
            if ( typeof(state) !== 'undefined' && state.value !== null) {
                if ( deviceType.deviceTypeIdentifier === 'Channel_0' ) {
                    this.lastChannel_0 = state.value === 1 ? 'on' : 'off';
                    msg = `\\"channel_0\\":\\"${this.lastChannel_0}\\"`;
                }
                
                if ( deviceType.deviceTypeIdentifier === 'Channel_1' ) {
                    this.lastChannel_1 = state.value === 1 ? 'on' : 'off';
                    msg = `\\"channel_1\\":\\"${this.lastChannel_1}\\"`;
                }

                if ( msg.length > 0 ) {
                    return Promise.resolve(msg)
                } else {
                    return Promise.reject(`Xiomi Module : invalid type for wired switch identifier whose identifier is "${this.sid}"`)
                }
            } else {
                return Promise.reject(`Xiomi Module : invalid status for wired switch identifier whose identifier is "${this.sid}"`)
            }
        } else {
            return Promise.reject(`Xiomi Module : the sid "${this.sid}" is not that of a wired switch.`)
        }
    }
}