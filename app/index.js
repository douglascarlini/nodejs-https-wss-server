const srvHTTP = require('./src/http-server');
const srvWS = require('./src/ws-server');
const utils = require('./src/utils');
const PORT = 80;

srvWS.init({

    onconnect(peer) {

        utils.log.debug(`peer connected: ${peer.ip}`);

    },

    http: srvHTTP.init({

        port: PORT,

        onrequest: p => new Promise(async (res, rej) => {

            utils.log.debug(`http from ${p.ip}`);
            srvWS.bounce = r => res(r);
            srvWS.broadcast(p.body);

        })

    })

})