const utils = require('./utils');
const ws = require('ws');

module.exports = {

    peers: {},
    server: null,
    bounce: null,

    init(conf) {

        try {

            this.server = new ws.Server({ server: conf.http });

            this.server.on('connection', (peer, req) => {

                peer.ip = req.connection.remoteAddress.replace('::ffff:', '');
                peer.on('message', (message) => this.manage(peer, message));
                var save = (peer) => this.peers[peer.ip] = peer;
                peer.authorized = false;
                conf.onconnect(peer);
                save(peer);

            });

        } catch (e) { utils.log.error({ init: `${e.message || e}` }); }

    },

    manage(peer, message) {

        var ip = peer.ip;

        try {

            var data = JSON.parse(message);

            if (!peer.authorized) {

                if ('token' in data) {

                    this.peers[ip].authorized = true;
                    peer.send(JSON.stringify({ ip, token: true }));

                } else {

                    peer.send(JSON.stringify({ ip, token: false }));
                    this.peers[ip].close();
                    delete this.peers[ip];

                }

            }

            if (peer.authorized && this.bounce) this.bounce(data);

        } catch (e) {

            var error = `${e.message || e}`;
            console.log({ error, ip });

        }

    },

    broadcast(data, from) {

        return new Promise((res, rej) => {

            var clients = [];

            try {

                for (var ip in this.peers) {

                    if (ip == from) continue;
                    if (this.send(ip, data)) clients.push(ip);

                }

                res({ clients });

            } catch (e) {

                var error = `${e.message || e || 'broadcast error'}`;
                utils.log.error({ broadcast: error });
                rej({ error });

            }

        });

    },

    send(to, data = null) {

        try {

            if (!(to in this.peers)) throw Error(`ws-send: client not found`);
            if (!this.peers[to].authorized) throw Error(`ws-send: client unauthorized`);

            var json = JSON.stringify(data);
            var er = this.peers[to].send(json, er => er);
            if (er) { delete this.peers[to]; throw Error(er) }

            return true;

        } catch (e) {

            var error = `${e.message || e || 'send error'}`;
            utils.log.error({ send: error });
            return false;

        }

    }

};