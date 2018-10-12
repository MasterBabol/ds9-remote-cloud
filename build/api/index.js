'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _inventory = require('./inventory');

var _inventory2 = _interopRequireDefault(_inventory);

var _signal = require('./signal');

var _signal2 = _interopRequireDefault(_signal);

var _technology = require('./technology');

var _technology2 = _interopRequireDefault(_technology);

var _localEstate = require('./localEstate');

var _localEstate2 = _interopRequireDefault(_localEstate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/status', _status2.default);
router.use('/inventory', _inventory2.default);
router.use('/signal', _signal2.default);
router.use('/technology', _technology2.default);
router.use('/local-estate', _localEstate2.default);

exports.default = router;