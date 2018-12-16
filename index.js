module.exports = function (sails) {
    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');
    var listen = require('./lib/listen.js');
    var setup = require('./lib/setup.js');

    gladys.on('ready', function(){
        listen();
    });

    return {
        install: install,
        setup: setup,
        exec: exec,
    };
};