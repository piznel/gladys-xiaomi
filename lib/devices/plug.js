const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

module.exports = class Plug extends GenericDevice {
  constructor(sid, ip, modelX) {
    super(sid, ip, 'plug', modelX);
    this.lastStatus = null; // 'on' or 'off'
    this.lastPower_consumed = 0;
    this.lastLoad_power = 0;
    this.lastInuse = 0;
  }

  deviceMessage(message, ip) {

    this.ip = ip;

    if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
      let data = JSON.parse(message.data);
      var eventdata = {};
      eventdata.sid = this.sid;
      eventdata.model = this.model;

      if (data.status) {
        if (data.status !== 'unknow') {
          this.lastStatus = data.status;
          eventdata.lastStatus = this.lastStatus;
        }
      }

      if (data.power_consumed) {
        this.lastPower_consumed = data.power_consumed;
        eventdata.total_power = this.lastPower_consumed;
      }

      if (data.load_power) {
        this.lastLoad_power = data.load_power;
        eventdata.instantaneous_power = this.lastLoad_power;
      }

      if (data.inuse) {
        this.lastInuse = data.inuse;
        eventdata.inuse = this.lastInuse;
      }
      return Promise.resolve({ msg: 'event', data: eventdata });
    }
    return Promise.resolve('success');
  }

  deviceExec(deviceType, state) {
    if (deviceType.identifier === this.sid) {
      if (typeof(state) !== 'undefined' && state.value !== null) {
        this.lastStatus = state.value === 1 ? 'on' : 'off';
        const msg = `\\"status\\":\\"${this.lastStatus}\\"`;
        console.error('deviceExec.msg :', msg)
        return Promise.resolve(msg)
      } else {
        return Promise.reject(`Xiomi Module : invalid status for plug identifier whose identifier is "${this.sid}"`)
      }
    } else {
      return Promise.reject(`Xiomi Module : the sid "${this.sid}" is not that of a plug.`)
    }
  }
}