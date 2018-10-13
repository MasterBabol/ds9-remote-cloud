'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var dbDefaultGlobalResearches = {
    'global-researches': {}
};

var mergeTechnologies = function mergeTechnologies(dst, src) {
    var newDst = _lodash2.default.cloneDeep(dst);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(src)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (newDst[key] != undefined) {
                var res = newDst[key];
                if (res.researched == false) res.researched = src[key].researched;
                if (res.level < src[key].level) res.level = src[key].level;
            } else {
                newDst[key] = {
                    researched: src[key].researched,
                    level: src[key].level
                };
            }
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

    return newDst;
};

/*
router.get('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    if (le.value()) {
        let leResearches = le.defaults({
            'researches': {}
        }).get('researches').value();
        res.status(200).send(leResearches);
    }
    else
        res.status(404).end();
});
*/

router.post('/:id', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var le = db.get('local-estates').find({ id: leId });
    var gsigs = db.defaults(dbDefaultGlobalResearches).get('global-researches');
    if (le.value()) {
        /*let leResearchesRaw = le.defaults({
            'researches': {}
        }).get('researches');
        let leResearches = leResearchesRaw.value();*/

        var newResearches = req.body;
        /*le.set('researches', newResearches).write();*/
        var mergedResearches = mergeTechnologies(gsigs.value(), newResearches);
        db.set('global-researches', mergedResearches).write();

        res.status(200).send({});
    } else res.status(404).end();
});

router.get('*', function (req, res) {
    var db = req.db.read();
    var leId = req.params.id;
    var leGlobalResearches = db.defaults(dbDefaultGlobalResearches).get('global-researches');
    res.status(200).send(leGlobalResearches.value());
});

exports.default = router;