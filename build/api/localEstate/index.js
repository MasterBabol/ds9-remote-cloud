'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _sigops = require('../signal/sigops');

var _sigops2 = _interopRequireDefault(_sigops);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var le = db.get('local-estates').find({ id: leId });
    var leInfoRaw = le.value();
    if (leInfoRaw) {
        res.status(200).send({});
    } else res.status(404).end();
});

router.post('/:id', function (req, res) {
    if (req.auth.type != 'user') {
        res.status(403).end();
        return;
    }
    var db = req.db.read();
    var leId = req.params.id;
    var les = db.get('local-estates');
    var le = les.find({ id: leId });
    var users = db.get('users');
    var user = users.find({ id: leId });
    if (le.value() || user.value()) res.status(409).end();else {
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

            res.status(200).send({});
        } catch (e) {
            if (isNaN(e)) res.status(500).end();else res.status(e).end();
        }
    }
});

router.delete('/:id', function (req, res) {
    if (req.auth.type != 'user') {
        res.status(403).end();
        return;
    }
    var db = req.db.read();
    var leId = req.params.id;
    var les = db.get('local-estates');
    var le = les.find({ id: leId });
    if (le.value()) {
        try {
            var gsigs = db.defaults({ 'global-announced-signals': {} }).get('global-announced-signals');
            var leSignalsRaw = le.defaults({ 'announced-signals': {} }).get('announced-signals');
            var leSignals = leSignalsRaw.value();

            var subtracted = _sigops2.default.subtractSignals(gsigs.value(), leSignals);
            db.set('global-announced-signals', subtracted).write();

            les.remove({ id: leId }).write();

            res.status(200).end({});
        } catch (e) {
            if (isNaN(e)) res.status(500).end();else res.status(e).end();
        }
    } else res.status(404).end();
});

router.get('*', function (req, res) {
    var db = req.db.read();
    var les = db.get('local-estates').value();
    var lesInfo = [];
    if (les) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = les[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var le = _step.value;

                lesInfo.push(le.id);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    res.status(200).send(lesInfo);
});

exports.default = router;