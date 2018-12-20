const crypto = require('crypto');
const GenericDevice = require('./genericDevice.js');
const AQARA_IV = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);
const Promise = require('bluebird');

var shared = require('../xiaomi.shared.js');

module.exports = class Gateway extends GenericDevice {
  constructor(sid, ip, modelX, password, sendSocket) {
    super(sid, ip, 'gateway', modelX);
    this.illumination = 0;
    this.intensity = 0; // decimal value
    this.color = 0; // decimal value
    this._token = '';
    this._password = password;
    this._sendSocket = sendSocket;

    // ask for devices list
    this._sendSocket('{"cmd": "get_id_list"}');
  }

  deviceMessage(message, ip) {

    this.ip = ip;

    // get details for each device
    switch (message.cmd) {
      case 'get_id_list_ack':
        const msg = `{"cmd": "read", "sid": "${this.sid}"}`;
        this._sendSocket(msg);
        var sids = JSON.parse(message.data);

        // send "read" command with 100 ms delay
        var i = 0
        sids.forEach((sid) => {
          setTimeout(() => {
            i++
            const msg = `{"cmd": "read", "sid": "${sid}"}`;

            // *********DEBUG START*******************
            if (shared.debug === 10) sails.log.debug('Xiaomi gateway read :', msg)
            // *********DEBUG END******************* 

            this._sendSocket(msg);
          }, 200 * i)
        })
        break;

      case 'heartbeat':
        this._token = message.token;
        this._password = shared.passwords.get(this.sid)
        break;

      case 'report':
      case 'read_ack':
        const data = JSON.parse(message.data);
        if (data.illumination)
          this.illumination = data.illumination;

        if (data.rgb || data.rgb === 0) {
          if (data.rgb !== 0 && data.rgb !== null) {
            var rgb = data.rgb.toString(16);

            this.intensity = parseInt(rgb.substr(0, rgb.length - 6), 16);

            if (rgb.length > 2) {
              this.color = parseInt(rgb.substr(rgb.length - 6, 6), 16);
            }
          } else {
            this.intensity = 0;
            this.color = 0;
          }
        }

        if (message.cmd === 'report')
          return Promise.resolve({ msg: 'event', data: { sid: this.sid, model: this.model, color: this.color, intensity: this.intensity, illumination: this.illumination } });

    }
    return Promise.resolve('success');
  }

  playSound(sound, volume) {
    this._password = shared.passwords.get(this.sid)
    if (typeof(sound) !== 'undefined' && sound !== null && typeof(volume) !== 'undefined' && intensvolumeity !== null && typeof(this._password) !== 'undefined' && this._password.length !== 0) {
      const _volume = volume ? volume : 20;
      const msg = `{"cmd": "write", "model": "gateway", "sid": "${this.sid}", "data": "{\\"mid\\":${sound}, \\"vol\\":${_volume}, \\"key\\": \\"${this._calculateKey()}\\"}"}`;
      this._sendSocket(msg);
    }
  }

  setColor(color, intensity) {
    this._password = shared.passwords.get(this.sid)
    if (typeof(color) !== 'undefined' && color !== null && typeof(intensity) !== 'undefined' && intensity !== null && typeof(this._password) !== 'undefined' && this._password.length !== 0) {
      this.color = color
      this.intensity = intensity;

      var _color = this.color.toString(16)
      _color = _color.padStart(6, '0')

      var _intensity = this.intensity.toString(16);
      _intensity = _intensity.padStart(2, '0')

      const value = parseInt(_intensity + _color, 16);

      const msg = `{"cmd": "write", "model": "gateway", "sid": "${this.sid}", "data": "{\\"rgb\\":${value}, \\"key\\": \\"${this._calculateKey()}\\"}"}`;
      this._sendSocket(msg);
    } else {
      sails.log.error(`Xiaomi module : Password's gateway  sid '${this.sid}' undefined !`)
    }
  }

  sendCommand(model, sid, cmd) {
    this._password = shared.passwords.get(this.sid)
    if(typeof(this._password) !== 'undefined' && this._password.length !== 0  )  {
      const msg = `{"cmd": "write", "model": "${model}", "sid": "${sid}", "data": "{${cmd}, \\"key\\": \\"${this._calculateKey()}\\"}"}`;

      // *********DEBUG START*******************
      if (shared.debug === 7 || shared.debug === 10) sails.log.debug('Xiaomi gateway.sendCommand :', msg)
      // *********DEBUG END*******************

      this._sendSocket(msg);      
    } else {
      sails.log.error(`Xiaomi module : Password's gateway sid '${this.sid}' undefined !`)
    }
  }

  // ---------- private methods ----------
  _calculateKey() {
    //if(typeof(this._password) !== 'undefined' && this._password.length !== 0  )  {  
      const cipher = crypto.createCipheriv('aes-128-cbc', this._password, AQARA_IV);
      return cipher.update(this._token, 'ascii', 'hex');
    //}
  }
}