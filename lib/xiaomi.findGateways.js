const Promise = require('bluebird');
const dgram = require('dgram');

const DISCOVERY_PORT = 4321;
const SERVER_PORT = 9898;
const MULTICAST_ADDRESS = '224.0.0.50';
var gateways = new Map();
var search = true;

module.exports = function setup(){
    return new Promise(function (resolve, reject) {
        const server = dgram.createSocket( {type: 'udp4', reuseAddr: true} );

        server.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            server.close();
        });

        server.on('message', (msg) => {
            const message = JSON.parse(msg.toString());
            if (message.cmd === 'iam') {
                gatewayFound(message)
            }

            if (!search) {
                sails.log.error('fin de la recherche')
                server.close();
                if(gateways.size > 0) {
                   return Promise.resolve(saveGateways()) 
                } else {
                    return Promise.reject('any gateway found')
                }
                
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

        setTimeout(() => {
            search = false
        }, 2000);

    /*
        return Promise.delay(2000).then(() => {
            search = false
            return ('success');
        })
    */
    })
};

function gatewayFound(msg) {
    if(!gateways.has(msg.sid)) {
        gateways.set(msg.sid, msg.ip)
    }
}

function saveGateways() {
	return gladys.param.getValue('Xiaomi_password_test')
	    .then((result) => {
            return Promise.resolve (controlParam(result))
	    })
	    .catch(() => {
            return Promise.resolve (createParam())
	    });
}

function controlParam(param) {
    for (let [sid, ip] of gateways) {
        if(!param.hasOwnProperty(sid)) {
            param[sid] = 'password'
        }
    }
    console.log('param :', param)
    return Promise.resolve(param)
}

function createParam() {
    let param = [];
    for (let sid of gateways.keys()) {
            param[sid] = 'password'
        } 
    console.log('param :', param)
    return Promise.resolve(param)
}



