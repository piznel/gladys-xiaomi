const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const MIN_VOLT = 2800
const MAX_VOLT = 3300

module.exports = class MotionAqara extends GenericDevice {
  constructor(sid, ip, modelX) {
    super(sid, ip, 'motion_sensor_aqara', modelX);
    this.lastStatus = null;
    this.lastMotion = 0;
    this.illumination = 0;
    this.battery = null;
  }

  deviceMessage(message, ip) {

    this.ip = ip;

    if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
      let data = JSON.parse(message.data);
      var eventdata = {};
      eventdata.sid = this.sid;
      eventdata.model = this.model;

      if (data.status) {
        this.lastStatus = data.status;
        eventdata.lastStatus = this.lastStatus;
        this.lastMotion = 0;
        eventdata.lastmotion = this.lastMotion;
      }
      // in case of inactivity, json contains only 'no_motion' field
      // with seconds from last motion as the value (reports '120', '180', '300', '600', '1200' and finally '1800')
      if (data.no_motion) {
        this.lastStatus = 'no_motion';
        eventdata.lastStatus = this.lastStatus;
        this.lastMotion = data.no_motion / 60;
        eventdata.lastmotion = this.lastMotion;
      }

      if (data.lux) {
        this.illumination = data.lux;
        eventdata.illumination = this.illumination
      }

      if (data.illumination) {
        this.illumination = data.illumination;
        eventdata.illumination = this.illumination
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