// 
// 86SW1

const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const SWITCH_STATUS = {
  sleep: 0,
  click: 1,
  double_click: 2,
};

module.exports = class SingleWirelessSwitch extends GenericDevice {
  constructor(sid, ip, modelX, sendSocket) {
    super(sid, ip, 'Single_Wireless_Switch', modelX);
    this.lastChannel_0 = null; // 0, 1 or 2
    this._sendSocket = sendSocket;
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
        Promise.delay(1000).then(() => {
          eventdata.Channel_0 = 0;
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