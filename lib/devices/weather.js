const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const MIN_VOLT = 2800
const MAX_VOLT = 3300

module.exports = class Weather extends GenericDevice {
  constructor(sid, ip, modelX) {
    super(sid, ip, 'weather', modelX);
    this.temperature = 0;
    this.humidity = 0;
    this.pressure = 0;
    this.battery = null;
  }

  deviceMessage(message, ip) {

    this.ip = ip;

    if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
      let data = JSON.parse(message.data);
      var eventdata = {};
      eventdata.sid = this.sid;
      eventdata.model = this.model;

      if (data.temperature) {
        let tmpTemp = Math.round(data.temperature / 10) / 10;
        if(tmpTemp != this.temperature) {
          this.temperature = tmpTemp;
          eventdata.temperature = this.temperature;
        }
      }

      if (data.humidity) {
        let tmpHum = Math.round(data.humidity / 100);
        if (tmpHum != this.humidity){
          this.humidity = tmpHum;
          eventdata.humidity = this.humidity;          
        }
      }

      if (data.pressure) {
        let tmpPress = Math.round(data.pressure / 100) / 10;
        if(tmpPress != this.pressure) {
          this.pressure = Math.round(data.pressure / 100) / 10;
          eventdata.pressure = this.pressure;          
        }
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