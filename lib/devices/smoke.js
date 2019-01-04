const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const MIN_VOLT = 2800
const MAX_VOLT = 3300

module.exports = class Smoke extends GenericDevice {
  constructor(sid, ip, modelX) {
    super(sid, ip, 'smoke', modelX);
    this.lastStatus = null;
    this.lastDensity = null;
    this.battery = null;
  }

  deviceMessage(message, ip) {

    this.ip = ip;

    if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
      let data = JSON.parse(message.data);
      var eventdata = {};
      eventdata.sid = this.sid;
      eventdata.model = this.model;

      if (data.alarm) {
        this.lastStatus = data.status;
        eventdata.alarm = this.lastStatus;
      }

      if (data.density) {
        this.lastDensity = data.density;
        eventdata.density = this.lastDensity;
      }

      if (data.voltage) {
        this.battery = Math.round((MAX_VOLT - data.voltage) / (MAX_VOLT - MIN_VOLT) * 100);
        eventdata.battery = this.battery;
      }
      return Promise.resolve({ msg: 'event', data: eventdata });
    } else {
      return Promise.reject('Xiaomi home : bad message - ' + message);
    }
  }
}