const Promise = require('bluebird');
module.exports = class GenericDevice {
    constructor(sid, model) {
        this.model = model;
        this.sid = sid;
    }

    deviceMessage(message) {
        return Promise.resolve('success');
    }
}