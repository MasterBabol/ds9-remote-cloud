'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _sigops = require('./sigops');

var _sigops2 = _interopRequireDefault(_sigops);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var le = db.get('local-estates').find({ id: leId });
    if (le.value()) {
        var leSignals = le.defaults({
            'announced-signals': {}
        }).get('announced-signals').value();
        res.status(200).send(leSignals);
    } else res.status(404).end();
});

router.post('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var le = db.get('local-estates').find({ id: leId });
    var gsigs = db.defaults(_sigops2.default.dbDefaultGlobalAnnouncedSignals).get('global-announced-signals');
    if (le.value()) {
        var leSignalsRaw = le.defaults({
            'announced-signals': {}
        }).get('announced-signals');
        var leSignals = leSignalsRaw.value();

        var newSignals = req.body; // {name: count, ...}
        le.set('announced-signals', newSignals).write();
        var subtracted = _sigops2.default.subtractSignals(newSignals, leSignals);
        var newGsignals = gsigs.value();
        var added = _sigops2.default.addSignals(newGsignals, subtracted);
        db.set('global-announced-signals', added).write();

        res.status(200).end();
    } else res.status(404).end();
});

router.get('*', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var leGlobalSignals = db.defaults(_sigops2.default.dbDefaultGlobalAnnouncedSignals).get('global-announced-signals');
    res.status(200).send(leGlobalSignals);
});

exports.default = router;