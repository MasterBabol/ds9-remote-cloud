'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _expressBasicAuth = require('express-basic-auth');

var _expressBasicAuth2 = _interopRequireDefault(_expressBasicAuth);

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _FileSync = require('lowdb/adapters/FileSync');

var _FileSync2 = _interopRequireDefault(_FileSync);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = 3000;
var devPort = 4000;

var adapter = new _FileSync2.default('db.json');
var db = (0, _lowdb2.default)(adapter);

app.use((0, _morgan2.default)('short'));
app.use(_express2.default.json());

app.use('/api', function (req, res, next) {
    req.db = db;
    if (req.method == 'GET') next();else (0, _expressBasicAuth2.default)({
        challenge: true,
        authorizer: function authorizer(username, password) {
            var found = db.get('local-estates').find({ "id": username }).value();

            if (found && found.accessToken == password) {
                req.auth.type = 'le';
                return true;
            }

            found = db.get('users').find({ "id": username }).value();
            if (found && found.accessToken == password) {
                req.auth.type = 'user';
                return true;
            }
            return false;
        }
    })(req, res, next);
}, _api2.default);
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));
app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, './../public/index.html'));
});

app.use(function (err, req, res, next) {
    if (err.statusCode) res.status(err.statusCode).end();else {
        console.error(err.stack);
        res.status(500).send('500 Internal Server Error');
    }
});

if (process.env.NODE_ENV == 'development') {
    console.log('[!] Server is running on development mode');
    var config = require('../webpack.dev.config');
    var compiler = (0, _webpack2.default)(config);
    var devServer = new _webpackDevServer2.default(compiler, config.devServer);
    devServer.listen(devPort, function () {
        console.log('[!] webpack-dev-server is listening on port', devPort);
    });
}

var server = _http2.default.createServer(app);

server.timeout = 10000;
server.keepAliveTimout = 15000;

server.on('connection', function (socket) {
    var remoteAddr = socket.remoteAddress;
    socket.on('close', function (hadError) {
        var e = '',
            nq = '',
            ns = '';
        if (hadError) e = 'e';
        if (!socket.request) nq = 'q';
        if (!socket.response) ns = 's';
        console.log('[!] A client socket (' + remoteAddr + ') had an error: ' + e + nq + ns);
    });
});
server.on('request', function (req, res) {
    req.socket.request = req;
    req.socket.response = res;
});

server.listen(port, function () {
    console.log('[!] Express is listening on port ' + port);
});