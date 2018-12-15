const events = require('events');
const dgram = require('dgram');
const Promise = require('bluebird');

const shared = require('./shared.js');

const GenericDevice = require('./devices/genericDevice.js');
const Gateway = require('./devices/gateway.js');
const Switch = require('./devices/switch.js');
const TempSensor = require('./devices/tempSensor.js');
const Motion = require('./devices/motion.js');
const Cube = require('./devices/cube.js');
const Weather = require('./devices/weather.js');
const Magnet = require('./devices/magnet.js');
const MotionAqara = require('./devices/motion.aqara.js');
const Plug = require('./devices/plug.js');
const Smoke = require('./devices/smoke.js');
const Leak = require('./devices/leak.js');
const Vibration = require('./devices/vibration.js');
const SingleWiredSwitch = require('./devices/single.wired.switch.js');
const DuplexWiredSwitch = require('./devices/duplex.wired.switch');
const SingleWiredSwitchLN = require('./devices/single.wired.switch.ln');
const DuplexWiredSwitchLN = require('./devices/duplex.wired.switch.ln');

const DISCOVERY_PORT = 4321;
const SERVER_PORT = 9898;
const MULTICAST_ADDRESS = '224.0.0.50';

const DEBUG = true;

module.exports = class Xiaomi extends events.EventEmitter {

  constructor() {
    super();
    this.ready = false; // We are ready to work and transmit to Gladys!
    this.devices = new Map(); // contains all devices with features, without gateway(s) ; the key is the sid, the value is the object 
    this._devicesRead = false; // 'true' if all devices have responded to the "read" command, otherwise 'false'
    this._readHack = new Map(); // contains the sid of the devices and gateway(s) (the key's map) with'true' if they have answered the command "read", otherwise 'false' (the value's map)
    this._resendReadCount = 0; // resendRead() counter. Stop resenRead() at 5 times (total 10 sec), even if not all devices have responded.
    this.gatewayCount = 0;
    this._socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    this._socket.on('listening', this._onListening.bind(this));
    this._socket.on('message', this._onMessage.bind(this));
    this._socket.bind(SERVER_PORT);

    // starts the routine of checking the device responses to the "read" command
    this._resendRead();
  }

  getDetails() {
    return Promise.resolve(this.devices);
  }

  playSound(sound, volume, sid) {
    if (shared.gateways.has(sid)) {
      shared.gateways.get(sid).playSound(sound, volume)
    }
  }

  setColor(color, intensity, sid) {
    if (shared.gateways.has(sid)) {
      let gateway = shared.gateways.get(sid)
      gateway.setColor(color, intensity)
    }
  }

  deviceTurnOff(deviceType, status) {
    // what is the exec's target device?
    let selectedDevice = '';
    return this._findDevice(deviceType.identifier)
      .then((device) => {
        selectedDevice = device;
        // we get the command to send to the gateway
        return device.deviceExec(deviceType, status)
      })
      .then((answer) => {
        if (typeof(answer) != 'undefined' && answer != null && this.ready) {
          //We get the gateway on which the device depends and send it the command
          return this._getGatewayFromIp(selectedDevice.ip)
            .then((gateway) => {
              gateway.sendCommand(selectedDevice.model, selectedDevice.sid, answer);
            })
        }
      })
      .catch((err) => {
        sails.log.error(err)
      });
  }

  // ---------- private methods ----------

  // The socket is ready, we query the network to discover the gateway(s)
  _onListening() {
    this._socket.addMembership(MULTICAST_ADDRESS);
    this._Whois();
  }

  // Processing received messages
  _onMessage(msg, rsinfo) {
    const message = JSON.parse(msg.toString());
    // if (message.model === 'vibration') console.log('_onMessage.msg :', message)
    if (DEBUG) console.log('_onMessage.msg :', message)
    if (DEBUG) console.log('rsinfo :', rsinfo)
    const ip = rsinfo.address;

    // test if the device sending the message is already registered
    this._findDeviceMessage(message, ip)
      .then((device) => {
        // device found! we pass him the message for translation into "Gladys" language
        return device.deviceMessage(message)
          .then((answer) => {
            if (typeof(answer) != 'undefined' && answer != null && answer !== 'success') {
              if (this.ready) {
                this.emit(answer.msg, answer.data);
              }
            }
          })
          .catch((err) => {
            sails.log.error(err)
          })
      })
      .catch((err) => {
        sails.log.error(err)
      });

    // if everything isn't loaded, we process the message
    if (!this.ready) {
      switch (message.cmd) {
        // return message from the gateway to the instruction "get_id_ist" send to it. Contains the list of devices it knows.
        case 'get_id_list_ack':
          let sids = JSON.parse(message.data);
          // created the list of declared devices
          sids.forEach((sid) => {
            this._readHack.set(sid, false);
          })
          break

          // return message of a device at the "read" instruction send to it. Contains details of the device.
        case 'read_ack':
          // records that he replied
          this._readHack.set(message.sid, true);
          // test if all devices have responded to the "read".
          return this._testRead()
            .then((result) => {
              this._devicesRead = result;
            });
          break
      }
      // everything is ready!
      if (this._devicesRead) {
        this.ready = true;
        this.emit('ready');
      }

      if (DEBUG) {
        console.log('this._devicesRead :', this._devicesRead)
        console.log('shared.gateways :', shared.gateways)
        console.log('this.ready :', this.ready)
        console.log('this._readHack :', this._readHack)
        console.log('devices :', this.devices)
      }
    }

  }

  // sends the command "whois" on the socket; the gateways will respond back
  _Whois() {
    const payload = '{"cmd": "whois"}';
    this._socket.send(payload, 0, payload.length, DISCOVERY_PORT, MULTICAST_ADDRESS);
  }

  // returns the device object that sent the message, creating it if it does not yet exist.
  _findDeviceMessage(message, ip) {
    if (this.devices.has(message.sid)) {
      return Promise.resolve(this.devices.get(message.sid))
    } else {
      return this._createDevice(message, ip)
        .then((device) => {
          if (message.model === 'gateway') {
            shared.gateways.set(message.sid, device);
          }
          this.devices.set(message.sid, device);
          this._readHack.set(message.sid, true);
          return Promise.resolve(device)
        });
    }
  }

  // returns the device object that has the sid passed as a parameter 
  _findDevice(sid) {
    if (this.devices.has(sid)) {
      return Promise.resolve(this.devices.get(sid))
    }
    return Promise.reject('device not found')
  }

  // create device object
  _createDevice(message, ip) {
    let device;
    let sid = message.sid
    switch (message.model) {
      case 'gateway':
        let password = shared.password[this.gatewayCount]
        this.gatewayCount++
        this._readHack.set(sid, false);
        device = new Gateway(sid, ip, password, (msg) => {
          this._socket.send(msg, 0, msg.length, SERVER_PORT, ip, (cb) => {
            if (cb !== null) sails.log.error(cb)
          })
        });
        break
      case 'switch':
        device = new Switch(sid, ip, (msg) => {
          this.emit(msg.msg, msg.data);
        });
        break
      case 'sensor_ht':
        device = new TempSensor(sid, ip);
        break
      case 'motion':
        device = new Motion(sid, ip);
        break
      case 'sensor_cube.aqgl01':
        device = new Cube(sid, ip, (msg) => {
          this.emit(msg.msg, msg.data);
        });
        break
      case 'weather.v1':
        device = new Weather(sid, ip);
        break
      case 'magnet':
      case 'sensor_magnet.aq2':
        device = new Magnet(sid, ip);
        break
      case 'sensor_motion.aq2':
        device = new MotionAqara(sid, ip);
        break
      case 'plug':
        device = new Plug(sid, ip);
        break
      case 'sensor_wleak.aq1':
        device = new Leak(sid, ip);
        break
      case 'smoke':
        device = new Smoke(sid, ip);
        break
      case 'vibration':
        device = new Vibration(sid, ip, (msg) => {
          this.emit(msg.msg, msg.data);
        });
        break
      case 'ctrl_neutral1':
        device = new SingleWiredSwitch(sid, ip);
        break
      case 'ctrl_neutral2':
        device = new DuplexWiredSwitch(sid, ip);
        break
      case 'ctrl_ln1.aq1':
      case 'ctrl_ln1':
        device = new SingleWiredSwitchLN(sid, ip);
        break
      case 'ctrl_ln2.aq1':
      case 'ctrl_ln2':
        device = new DuplexWiredSwitchLN(sid, ip);
        break
      default:
        device = new GenericDevice(sid, ip, message.model);
    }
    return Promise.resolve(device);
  }

  // returns the gateway object corresponding to the ip passed as parameter
  _getGatewayFromIp(ip) {
    for (let gateway of shared.gateways.values()) {
      if (gateway.ip === ip) {
        return Promise.resolve(gateway);
      }
    }
    return Promise.reject('impossible to find the gateway')
  }

  _resendRead() {
    // wait 2 sec before check
    Promise.delay(2000).then(() => {
      // if we started working ...
      if (this._readHack.size > 0 && this.devices.size > 0) {
        // if we aren't yet ready ...
        if (!this.ready && this._resendReadCount < 5) {
          for (let [sid, status] of this._readHack) {
            if (!status) {
              if (DEBUG) console.log('resend read command :', this._resendReadCount)
              if (typeof(this.devices.get(sid)) !== 'undefined' && typeof(this.devices.get(sid).ip !== 'undefined')) {
                let ip = this.devices.get(sid).ip
                var msg = `{"cmd": "read", "sid": "${sid}"}`;
                if (DEBUG) console.log('resend msg :', msg)
                // resends the "read" command to devices that did not respond to it
                this._socket.send(msg, 0, msg.length, SERVER_PORT, ip, (cb) => {
                  if (cb !== null) sails.log.error(cb)
                });
              }
            }
          }
          this._resendReadCount = this._resendReadCount + 1;
          // restart a _resendRead()
          this._resendRead()
        } else {
          // we tested it five times, so much the worse for the last ones! Go to Gladys!
          this.ready = true;
          this.emit('ready')
        }
      } else {
        this._resendRead();
      }
    })
  }

  _testRead() {
    for (let result of this._readHack.values()) {
      if (!result) return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
}