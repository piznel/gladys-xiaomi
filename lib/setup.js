const Promise = require('bluebird');
const dgram = require('dgram');
const DISCOVERY_PORT = 4321;
const SERVER_PORT = 9898;
const MULTICAST_ADDRESS = '224.0.0.50';
var gateways = [];
var search = true;

module.exports = function setup(){

    chronoSearch()
        .then(() => {
            server.close();
            return Promise.resolve()
        })
        .catch((err) => {
            console.log('err')
        });

    const server = dgram.createSocket( {type: 'udp4', reuseAddr: true} );

    server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });

    server.on('message', (msg) => {
        const message = JSON.parse(msg.toString());
        if (message.cmd === 'iam') {
            gatewayFound(message.sid)

        }

        if (!search) {
            sails.log.error('fin de la recherche')
        }
    });

    server.on('listening', () => {
        console.error('début de la recherche')
        server.addMembership(MULTICAST_ADDRESS);
        const payload = '{"cmd": "whois"}';
        server.send(payload, 0, payload.length, DISCOVERY_PORT, MULTICAST_ADDRESS);
        setTimeout(() => {
            server.send(payload, 0, payload.length, DISCOVERY_PORT, MULTICAST_ADDRESS);
        }, 300)
    });

    server.bind(SERVER_PORT);


};

function gatewayFound(sid) {
    console.error('gateway found :', sid)
}

function chronoSearch() {
    Promise.delay(3000).then(() => {
        search = false
    })
}

