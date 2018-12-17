gateways = require('../lib/xiaomi.gateways.js');
uncreated = require('../lib/xiaomi.uncreatedDevices.js')
unknown = require('../lib/xiaomi.unknownDevices.js')

module.exports = {

  gateways: function(req, res, next){
    gateways()
      .then((result) => res.json(result))
  },

  uncreated: function(req, res, next){
    uncreated()
      .then((result) => res.json(result))
  },

  unknown: function(req, res, next){
    unknown()
      .then((result) => res.json(result))
  }

}
