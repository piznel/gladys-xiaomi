const GenericDevice = require('./genericDevice.js');
const Promise = require('bluebird');

const MIN_VOLT = 2800
const MAX_VOLT = 3300

const cube_sides = [ 
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
];

module.exports = class Vibration extends GenericDevice {
    constructor(sid, ip, sendSocket) {
        super(sid, 'vibration');
        this.lastStatus = 0;
        this.lastFinal_tilt_angle = 0;
        this.lastAcceleration_X = 0;
        this.lastAcceleration_Y = 0;
        this.lastAcceleration_Z = 0;
        this.lastUpperFace = 0;
        this.battery = null;
        this._sendSocket = sendSocket;
        this.ip = ip
    }

    deviceMessage(message) {

        if (message.cmd === 'report' || message.cmd === 'heartbeat' || message.cmd === 'read_ack') {
            let data = JSON.parse(message.data);
            var eventdata = {};
            eventdata.sid = this.sid;
            eventdata.model = this.model;

            if (data.status) {
                // status can be "vibrate", "tilt", "free_fall". "tilt" is always followed by a "final_tilt_angel" state
                this.lastStatus = data.status;
                eventdata.lastStatus = this.lastStatus;
                Promise.delay(1000).then(() => {
                    eventdata.lastStatus = 'sleep';
                    this._sendSocket({ msg: 'event', data: eventdata });
                })
            }

            if (data.final_tilt_angle) {
                this.lastFinal_tilt_angle = data.final_tilt_angle;
                eventdata.tilt_angle = this.lastFinal_tilt_angle;
            }

            if (data.coordination) {
                this.lastAcceleration_X = parseInt(data.coordination.split(',')[0]);
                this.lastAcceleration_Y = parseInt(data.coordination.split(',')[1]);
                this.lastAcceleration_Z = parseInt(data.coordination.split(',')[2]);

                eventdata.acceleration_X = this.lastAcceleration_X;
                eventdata.acceleration_Y = this.lastAcceleration_Y;
                eventdata.acceleration_Z = this.lastAcceleration_Z;
                upperFace(this.lastAcceleration_X, this.lastAcceleration_Y, this.lastAcceleration_Z)
                .then((side) => {
                    this.lastUpperFace = side
                    this._sendSocket({ msg: 'event', data: { sid: this.sid, model: this.model, upper_face: side }});
                })
            }

            if (data.bed_activity) {
                this.lastBed_activity = data.bed_activity;
                eventdata.bed_activity = this.lastBed_activity;
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

function upperFace(Ax, Ay, Az)
{
  largest_dot = 0;
  closest_side = -1; // will return -1 in case of a zero A vector
  for (var side = 0; side < 6; side++)
  {
    var dot = (cube_sides[side][0] * Ax) +
                (cube_sides[side][1] * Ay) +
                (cube_sides[side][2] * Az);
    if (dot > largest_dot)
    {
      largest_dot = dot;
      closest_side = side;
    }
  }
  return Promise.resolve(closest_side);
}