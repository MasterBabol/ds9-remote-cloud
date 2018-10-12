'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var dbDefaultLastStatus = {
    'last-status': {
        'discovered-time': 0,
        'online': false,
        'cpuUse%': -1,
        'memUse%': -1,
        'memTotalMB': -1
    }
};

router.get('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var le = db.get('local-estates').find({ id: leId });
    if (le.value()) {
        var leLastStatus = le.defaults(dbDefaultLastStatus).get('last-status').value();
        var leLastDiscovered = leLastStatus['discovered-time'];
        if (leLastDiscovered + 30 * 1000 < new Date().getTime()) {
            leLastStatus = Object.assign({}, dbDefaultLastStatus['last-status']);
            leLastStatus['discovered-time'] = leLastDiscovered;
        }
        res.status(200).send(leLastStatus);
    } else res.status(404).end();
});

router.post('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var le = db.get('local-estates').find({ id: leId });
    if (le.value()) {
        var newStatus = Object.assign({}, dbDefaultLastStatus['last-status']);
        newStatus['discovered-time'] = new Date().getTime();
        newStatus['online'] = true;
        var cpuUse = req.body['cpuUse%'];
        newStatus['cpuUse%'] = cpuUse ? cpuUse : -1;
        var memUse = req.body['memUse%'];
        newStatus['memUse%'] = memUse ? memUse : -1;
        var memTotalMB = req.body['memTotalMB'];
        newStatus['memTotalMB'] = memTotalMB ? memTotalMB : -1;
        le.set('last-status', newStatus).write();
        if (isNaN(cpuUse) || isNaN(memUse) || isNaN(memTotalMB)) res.status(400).end();else res.status(200).end();
    } else res.status(404).end();
});

router.get('*', function (req, res) {
    var cpuAvg = _os2.default.loadavg();
    var cpuAvg60s = cpuAvg[0];
    var memTotal = _os2.default.totalmem();
    var memFree = _os2.default.freemem();

    var serverStatus = {
        'cpuUse%': Number((100 * cpuAvg60s).toFixed(1)),
        'memUse%': Number((100 * (memTotal - memFree) / memTotal).toFixed(1)),
        'memTotalMB': Math.floor(memTotal / 1024 / 1024)
    };

    res.status(200).send(serverStatus);
});

router.post('*', function (req, res) {
    res.status(405).end();
});

exports.default = router;