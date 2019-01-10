module.exports = {
  xiaomi: {},
  passwords: new Map(), // contains password's gateway ; the key is the sid, the value is the password 
  debug: 0,
  debugDevice: '',
  gateways: new Map(), // contains all gateway(s) with features ; the key is the sid, the value is the object 
  errorDevices: new Map(), // Contains all devices declared by at least 2 gateways
  unknownDevices: new Map(), // contains all devices not managed by this module
  logUnknown: ''
}

/*
'debug' level (parameter : Xiaomi_debug)
0 = Nothing
1 = message only
2 = message and device
3 = message, device and read
4 = createDevice
5 = createDeviceState
6 = resend read
7 = command sent by the gateway
9 = all log ! Good luck ...


'debugDevice' level (parameter : Xiaomi_debug_device)
'name': name of xiaomi device
*/