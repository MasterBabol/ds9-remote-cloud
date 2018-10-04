import express from 'express';
import path from 'path';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import morgan from 'morgan'; // HTTP REQUEST LOGGER
import bodyParser from 'body-parser'; // PARSE HTML BODY

import session from 'express-session';

import api from './api';

import http from 'http';

const app = express();
const port = 3000;
const devPort = 4000;

app.use(morgan('dev'));
app.use(bodyParser.json());

/* use session */
app.use(session({
    secret: 'sessionsecret',
    resave: false,
    saveUninitialized: true
}));

app.use('/api', api);

app.use('/', express.static(path.join(__dirname, './../public')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

/* handle error */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
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

