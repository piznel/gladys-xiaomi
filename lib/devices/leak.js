const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const MIN_VOLT = 2800
const MAX_VOLT = 3300

module.exports = class Leak extends GenericDevice {
  constructor(sid, ip, modelX) {
    super(sid, ip, 'leak', modelX);
    this.lastStatus = null;
    this.battery = null;
  }

  deviceMessage(message, ip) {

    this.ip = ip;

    if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
      let data = JSON.parse(message.data);
      var eventdata = {};
      eventdata.sid = this.sid;
      eventdata.model = this.model;

      if (data.status === 'leak' || data.status === 'no_leak') {
        this.lastStatus = data.status;
        eventdata.lastStatus = this.lastStatus;
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