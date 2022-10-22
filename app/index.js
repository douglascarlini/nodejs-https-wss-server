const srvHTTP = require('./src/http-server');
const srvWS = require('./src/ws-server');
const utils = require('./src/utils');
const PORT = 80;

srvWS.init({

    onconnect(peer) {

        utils.log.debug(`ws peer connected: ${peer.ip}`);

    },

    http: srvHTTP.init({

        port: PORT,

        onrequest: (p) => new Promise(async (res, rej) => {

            var msg = `HTTP ${p.method} ${p.url} from ${p.ip}`;
            var error = { error: 'no response from ws' };
            setTimeout(() => res(error), 5000);
            srvWS.bounce = (r) => res(r);
            srvWS.broadcast(p.body);
            utils.log.debug(msg);

        })

    })

})