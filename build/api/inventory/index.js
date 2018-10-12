'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var dbDefaultInventory = {
    'inventory': {}
};

router.get('*', function (req, res) {
    var db = req.db.read();
    var globalInv = db.defaults(dbDefaultInventory).get('inventory').value();

    res.status(200).send(globalInv);
});

router.post('*', function (req, res) {
    var db = req.db.read();
    var globalInv = db.defaults(dbDefaultInventory).get('inventory');

    try {
        var invReq = req.body.items;
        if (invReq) {
            var applies = {};
            var dbmods = [];
            for (var itemName in invReq) {
                var count = invReq[itemName];
                var defaultItem = {};
                defaultItem[itemName] = 0;
                var have = globalInv.defaults(defaultItem).get(itemName);

                var newCount = have.value() + count;
                if (newCount < 0) {
                    if ('nonexact' in req.query) {
                        applies[itemName] = -have.value();
                        dbmods.push(globalInv.unset(itemName));
                    } else throw 404;
                } else {
                    applies[itemName] = count;
                    if (newCount > 0) dbmods.push(globalInv.set(itemName, newCount));else dbmods.push(globalInv.unset(itemName));
                }
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = dbmods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var dbmod = _step.value;

                    dbmod.write();
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

            res.status(200).send(applies);
        } else throw 400;
    } catch (e) {
        if (isNaN(e)) {
            res.status(500).end();
            console.log(e);
        } else res.status(e).end();
    }
});

exports.default = router;