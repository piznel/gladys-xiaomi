module.exports = function (sails) {
    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');
    var listen = require('./lib/listen.js');

    gladys.on('ready', function(){
        listen();
    });

    return {
        install,
        exec
    };
};