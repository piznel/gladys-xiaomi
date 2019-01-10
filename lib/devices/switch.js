const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const MIN_VOLT = 2800
const MAX_VOLT = 3300

module.exports = class Switch extends GenericDevice {
  constructor(sid, ip, modelX, sendSocket) {
    super(sid, ip, 'switch', modelX);
    this.lastStatus = null;
    this.battery = null;
    this._sendSocket = sendSocket;
  }

  deviceMessage(message, ip) {

    this.ip = ip;

    this.laststatus = 0
    if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
      this.lastStatus = JSON.parse(message.data).status;
      let data = JSON.parse(message.data);
      var eventdata = {};
      eventdata.sid = this.sid;
      eventdata.model = this.model;

      if (data.status) {
        this.lastStatus = data.status
        Promise.delay(1000).then(() => {
          this._sendSocket ({ msg: 'event', data: { sid: this.sid, model: this.model, lastStatus: 'no_click' } });
        })
      }

      if (data.voltage) {
        this.battery = Math.round((MAX_VOLT - data.voltage) / (MAX_VOLT - MIN_VOLT) * 100);
        eventdata.battery = this.battery;
      }
      eventdata.lastStatus = this.lastStatus;
      return Promise.resolve({ msg: 'event', data: eventdata });
    } else {
      return Promise.reject('Xiaomi home : bad message - ' + message);
    }
  }
}