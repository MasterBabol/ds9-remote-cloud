'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var dbDefaultGlobalAnnouncedSignals = {
    'global-announced-signals': {}
};

var addSignals = function addSignals(dst, src) {
    var newDst = Object.assign({}, dst);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(src)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (newDst[key] != undefined) {
                newDst[key] += src[key];
                if (newDst[key] == 0) delete newDst[key];
            } else if (src[key] != 0) newDst[key] = src[key];
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

var subtractSignals = function subtractSignals(dst, src) {
    var newDst = Object.assign({}, dst);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.keys(src)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            if (newDst[key] != undefined) {
                newDst[key] -= src[key];
            } else newDst[key] = -src[key];
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return newDst;
};

exports.default = { addSignals: addSignals, subtractSignals: subtractSignals };