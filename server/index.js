import express from 'express';
import path from 'path';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import crypto from 'crypto';
import morgan from 'morgan';
import http from 'http';
import basicAuth from 'express-basic-auth';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import api from './api';

const app = express();
const port = 3000;
const devPort = 4000;

const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(morgan('short'));
app.use(express.json());

app.use('/api', (req, res, next) => {
    req.db = db;
    if (req.method == 'GET')
        next();
    else
        basicAuth({
            challenge: true,
            authorizer: (username, password) => {
                let found = db.get('local-estates')
                    .find({ "id": username }).value();

                if (found && (found.accessToken == password)) {
                    req.auth.type = 'le';
                    return true;
                }

                found = db.get('users').find({ "id": username }).value();
                if (found && (found.accessToken == password)) {
                    req.auth.type = 'user';
                    return true;
                }
                return false;
            }
        })(req, res, next);
}, api);
app.use('/', express.static(path.join(__dirname, './../public')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

app.use(function(err, req, res, next) {
    if (err.statusCode)
        res.status(err.statusCode).end();
    else {
        console.error(err.stack);
        res.status(500).send('500 Internal Server Error');
    }
});

if(process.env.NODE_ENV == 'development') {
    console.log('[!] Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('[!] webpack-dev-server is listening on port', devPort);
        }
    );
}

const server = http.createServer(app);

server.timeout = 10000;
server.keepAliveTimout = 15000;

server.on('connection', function(socket) {
    console.log('[!] Connection from: ' + socket.remoteAddress);
});

server.listen(port, function() {
    console.log('[!] Express is listening on port ' + port);
});

