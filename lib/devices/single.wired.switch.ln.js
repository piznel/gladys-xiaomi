const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const SWITCH_STATUS = {
  on: 1,
  off: 0,
  unknow: -1
};

module.exports = class SingleWiredSwitchLN extends GenericDevice {
  constructor(sid, ip, modelX) {
    super(sid, ip, 'Single_Wired_Switch_N', modelX);
    this.lastChannel_0 = null; // 0 or 1
  }

  deviceMessage(message, ip) {

    this.ip = ip;

    if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
      let data = JSON.parse(message.data);
      var eventdata = {};
      eventdata.sid = this.sid;
      eventdata.model = this.model;

      if (data.channel_0) {
        this.lastChannel_0 = SWITCH_STATUS[data.channel_0];
        eventdata.Channel_0 = this.lastChannel_0;
      }

      return Promise.resolve({ msg: 'event', data: eventdata });
    }
    return Promise.resolve('success');
  }

  deviceExec(deviceType, state) {
    if (deviceType.identifier === this.sid) {
      if (typeof(state) !== 'undefined' && state.value !== null) {
        this.lastChannel_0 = state.value;
        let value = state.value === 1 ? 'on' : 'off';
        const msg = `\\"channel_0\\":\\"${value}\\"`;
        return Promise.resolve(msg)
      } else {
        return Promise.reject(`Xiaomi Module : invalid status for wired switch identifier whose identifier is "${this.sid}"`)
      }
    } else {
      return Promise.reject(`Xiaomi Module : the sid "${this.sid}" is not that of a wired switch.`)
    }
  }
}