gateways = require('../lib/xiaomi.gateways.js');
uncreated = require('../lib/xiaomi.uncreatedDevices.js');
unknown = require('../lib/xiaomi.unknownDevices.js');
savePassword = require('../lib/xiaomi.savePassword.js');

module.exports = {

  gateways: function(req, res, next) {
    gateways()
      .then((result) => {
        sails.log.error(result)
        res.json(result)
      })
      .catch(next);
  },

  uncreated: function(req, res, next) {
    uncreated()
      .then((result) => res.json(result))
      .catch(next);
  },

  unknown: function(req, res, next) {
    unknown()
      .then((result) => res.json(result))
      .catch(next);
  },

  savePassword: function(req, res, next) {
    savePassword(req.body)
      .then((result) => res.json(result))
      .catch(next);
  }
}