const crypto = require('crypto');
const GenericDevice = require('./genericDevice.js');
const AQARA_IV = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);
const Promise = require('bluebird');

var shared = require('../shared.js');

module.exports = class Gateway extends GenericDevice {
    constructor(sid, ip, password, sendSocket) {
        super(sid, 'gateway');

        this.illumination = 0;
        this.intensity = 0;              // decimal value
        this.color = 0;                  // decimal value
        this._token = '';
        this._password = password;
        this._sendSocket = sendSocket;
        this.ip = ip
        
        // ask for devices list
        this._sendSocket('{"cmd": "get_id_list"}');
    }

    deviceMessage(message) {

        // get details for each device
        switch (message.cmd) {
            case 'get_id_list_ack':
                const msg = `{"cmd": "read", "sid": "${this.sid}"}`;
                this._sendSocket(msg);
                var sids = JSON.parse(message.data);
                
                // send "read" command with 100 ms delay
                var i = 0
                sids.forEach((sid) =>{
                    setTimeout(() => {
                        i++
                        const msg = `{"cmd": "read", "sid": "${sid}"}`;
                        this._sendSocket(msg);                 
                    }, 200*i)
                })
                break;

            case 'heartbeat':
                this._token = message.token;
                break;

            case 'report':
            case 'read_ack':
                const data = JSON.parse(message.data);
                if (data.illumination)
                    this.illumination = data.illumination;

                if (data.rgb || data.rgb === 0 ) {
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
        const _volume = volume ? volume : 20;
        const msg = `{"cmd": "write", "model": "gateway", "sid": "${this.sid}", "data": "{\\"mid\\":${sound}, \\"vol\\":${_volume}, \\"key\\": \\"${this._calculateKey()}\\"}"}`;
        this._sendSocket(msg);
    }

    setColor(color, intensity) {
        if ( typeof(color) !== 'undefined' && color !== null && typeof(intensity) !== 'undefined' && intensity !== null) {
            this.color = color
            this.intensity = intensity;

            var _color = this.color.toString(16)
            _color = _color.padStart(6, '0')

            var _intensity = this.intensity.toString(16);
            _intensity = _intensity.padStart(2, '0')
                
            const value = parseInt(_intensity +  _color, 16);

            const msg = `{"cmd": "write", "model": "gateway", "sid": "${this.sid}", "data": "{\\"rgb\\":${value}, \\"key\\": \\"${this._calculateKey()}\\"}"}`;
            this._sendSocket(msg);
        }
    }

    sendCommand(model, sid, cmd) {
        const msg = `{"cmd": "write", "model": "${model}", "sid": "${sid}", "data": "{${cmd}, \\"key\\": \\"${this._calculateKey()}\\"}"}`;
        console.error('gateway.sendCommand :', msg )
        this._sendSocket(msg);
    }

    // ---------- private methods ----------
    _calculateKey() {
        const cipher = crypto.createCipheriv('aes-128-cbc', this._password, AQARA_IV);
        return cipher.update(this._token, 'ascii', 'hex');
    }
}