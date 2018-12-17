const Promise = require('bluebird');

module.exports = class GenericDevice {
    constructor(sid, ip, model, modelX) {
        this.model = model;
        this.sid = sid;
        this.modelX = modelX;
        this.ip = ip;
    }

    deviceMessage(message, ip) {
        return Promise.resolve('success');
    }
}