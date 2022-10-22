const utils = require('./utils');
const https = require('https');
const http = require('http');
const fs = require("fs");

module.exports = {

    server: null,

    init(conf) {

        if (fs.existsSync('certificate.pem')) {

            var certificate = fs.readFileSync('certificate.pem').toString();
            var private_key = fs.readFileSync('private_key.pem').toString();
            var options = { key: private_key, cert: certificate };
            var mode = `HTTP/WS: Server created [SSL-secure]`;
            this.server = https.createServer(options);

        } else {

            var mode = `HTTP/WS: Server created [non-SSL]`;
            this.server = http.createServer();

        }

        this.server.addListener("request", (req, res) => {

            var headers = {
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            };

            if (req.method == 'OPTIONS') {
                res.writeHead(204, headers);
                res.end();
                return;
            }

            var body = '';

            req.on('data', chunk => body += chunk.toString());

            req.on('end', () => {

                var data = {
                    body,
                    url: req.url,
                    method: req.method,
                    headers: req.headers,
                    ip: req.connection.remoteAddress.replace('::ffff:', ''),
                };

                conf.onrequest(data).then(resp => {

                    try {

                        resp = JSON.stringify(resp);
                        res.writeHead(200, headers);
                        res.write(resp);
                        res.end();

                    } catch (e) {

                        console.log(resp);

                        utils.log.error({ httpReq: e.message });
                        var body = e.message;
                        res.writeHead(500);
                        res.write(body);
                        res.end();

                    }

                }).catch(e => {

                    e = { code: e.code || 500, message: e.message || "Unknown error" };
                    utils.log.error({ httpReqError: e.message });
                    var json = JSON.stringify(e.message);
                    res.writeHead(e.code);
                    res.write(json);
                    res.end();

                });

            });

        });

        console.log(`HTTP/WS: Ouvindo porta ${conf.port}...`);
        this.server.listen(conf.port);
        utils.log.debug(mode);
        return this.server;

    }

}