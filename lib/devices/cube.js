const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const MIN_VOLT = 2800
const MAX_VOLT = 3300

module.exports = class Cube extends GenericDevice {
  constructor(sid, ip, modelX, sendSocket) {
    super(sid, ip, 'cube', modelX);
    this.lastStatus = null;
    this.lastRotate = 0;
    this.speed = 0;
    this.battery = null;
    this._sendSocket = sendSocket;
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
        Promise.delay(1000).then(() => {
          eventdata.lastStatus = 'sleep';
          this._sendSocket({ msg: 'event', data: eventdata });
        })
      }

      if (data.rotate) {
        this.lastStatus = 'rotate';
        this.lastRotate = data.rotate.split(',')[0];
        eventdata.rotate = this.lastRotate;
        this.speed = data.rotate.split(',')[1];
        eventdata.speed = this.speed;
        Promise.delay(1000).then(() => {
          eventdata.lastStatus = 'sleep';
          this._sendSocket({ msg: 'event', data: eventdata });
        })
      }

      if (data.voltage) {
        this.battery = Math.round((MAX_VOLT - data.voltage) / (MAX_VOLT - MIN_VOLT) * 100);
        eventdata.battery = this.battery;
      }

      eventdata.lastStatus = this.lastStatus;
      return Promise.resolve({ msg: 'event', data: eventdata });
    }
    return Promise.resolve('success');
  }
}