'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var le = db.get('local-estates').find({ id: leId });
    if (le.value()) res.status(200).end();else res.status(404).end();
});

router.post('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var les = db.get('local-estates');
    var le = les.find({ id: leId });
    if (le.value()) res.status(409).end();else {
        try {
            var leAccessToken = req.body.accessToken;
            var leType = req.body.type;

            if (!_validator2.default.isWhitelisted(leId, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-') || !leAccessToken || !leType) throw 400;

            var newLe = {
                'id': leId,
                'accessToken': leAccessToken,
                'type': leType
            };

            les.push(newLe).write();

            res.status(200).end();
        } catch (e) {
            if (isNaN(e)) res.status(500).end();else res.status(e).end();
        }
    }
});

router.delete('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var les = db.get('local-estates');
    var le = les.find({ id: leId });
    if (le.value()) {
        try {
            var leAccessToken = req.body.accessToken;

            if (!leAccessToken) throw 400;
            if (leAccessToken != le.value()['accessToken']) throw 403;

            les.remove({ id: leId }).write();

            res.status(200).end();
        } catch (e) {
            if (isNaN(e)) res.status(500).end();else res.status(e).end();
        }
    } else res.status(404).end();
});

exports.default = router;