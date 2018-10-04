import express from 'express';
import path from 'path';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import morgan from 'morgan';
import http from 'http';

import api from './api';

const app = express();
const port = 3000;
const devPort = 4000;

app.use(morgan('dev'));

app.use('/api', api);
app.use('/', express.static(path.join(__dirname, './../public')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('500 Internal Server Error');
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

server.listen(port, function() {
    console.log('[!] Express is listening on port ' + port);
});

