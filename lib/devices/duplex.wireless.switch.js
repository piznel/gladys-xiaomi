// WXKG02LM
// 86SW2

const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const SWITCH_STATUS = {
    sleep:0,
    click: 1,
    double_click: 2,
    both_click: 3
};

module.exports = class DuplexWirelessSwitch extends GenericDevice {
    constructor(sid, ip, modelX, sendSocket) {
        super(sid, ip, 'DuplexWirelessSwitch', modelX);
        this.lastChannel_0 = null; // 0, 1 or 2
        this.lastChannel_1 = null; // 0, 1 or 2
        this.lastDualChannel = null; // 0 or 3
        this._sendSocket = sendSocket;
    }

    deviceMessage(message) {

        if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
            let data = JSON.parse(message.data);
            var eventdata = {};
            eventdata.sid = this.sid;
            eventdata.model = this.model;

            if (data.channel_0) {
                this.lastChannel_0 = SWITCH_STATUS[data.channel_0];
                eventdata.Channel_0 = this.lastChannel_0;
                Promise.delay(1000).then(() => {
                    eventdata.Channel_0 = 0;
                    this._sendSocket({ msg: 'event', data: eventdata });
                })
            }

            if (data.channel_1) {
                this.lastChannel_1 = SWITCH_STATUS[data.channel_1];
                eventdata.Channel_1 = this.lastChannel_1;
                Promise.delay(1000).then(() => {
                    eventdata.Channel_1 = 0;
                    this._sendSocket({ msg: 'event', data: eventdata });
                })
            }

            if (data.dual_channel) {
                this.lastDualChannel = SWITCH_STATUS[data.dual_channel];
                eventdata.dual_channel = this.lastDualChannel;
                Promise.delay(1000).then(() => {
                    eventdata.dual_channel = 0;
                    this._sendSocket({ msg: 'event', data: eventdata });
                })
            }
            
            if (data.voltage) {
                this.battery = Math.round((MAX_VOLT - data.voltage) / (MAX_VOLT - MIN_VOLT) * 100);
                eventdata.battery = this.battery;
            }

            return Promise.resolve({ msg: 'event', data: eventdata });
        }
        return Promise.resolve('success');
    }
}