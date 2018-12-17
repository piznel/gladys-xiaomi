module.exports = function (sails) {
    const install = require('./lib/xiaomi.install.js');
    const exec = require('./lib/xiaomi.exec.js');
    const listen = require('./lib/xiaomi.listen.js');
    const xiaomiController = require('./controller/xiaomiController.js')

    gladys.on('ready', function(){
        listen();
    });

    return {
        install: install,
        exec: exec,
        routes: {
            before: {
                'get /xiaomi/gateways': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'get /xiaomi/uncreated': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'get /xiaomi/unknown': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next)

            },
            after: {
                'get /xiaomi/gateways': xiaomiController.gateways,
                'get /xiaomi/uncreated': xiaomiController.uncreated,
                'get /xiaomi/unknown': xiaomiController.unknown
            }
        }
    };
};