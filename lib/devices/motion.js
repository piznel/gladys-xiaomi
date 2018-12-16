const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const MIN_VOLT = 2800
const MAX_VOLT = 3300

module.exports = class Motion extends GenericDevice {
    constructor(sid, ip, modelX) {
        super(sid, ip, 'motion_sensor', modelX);
        this.lastStatus = null;
        this.lastMotion = 0;
        this.battery = null;
    }

    deviceMessage(message) {

        if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
            let data = JSON.parse(message.data);
            var eventdata = {};
            eventdata.sid = this.sid;
            eventdata.model = this.model;

            if (data.status) {
                this.lastStatus = data.status;
                eventdata.lastStatus = this.lastStatus;
                this.lastMotion = 0;
                eventdata.lastMotion = this.lastMotion;
            }

            if (data.no_motion) {
                this.lastStatus = 'no_motion';
                eventdata.lastStatus = this.lastStatus;
                this.lastMotion = data.no_motion / 60;
                eventdata.lastMotion = this.lastMotion;
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