import express from 'express';
import os from 'os';

import status from './status';
import inventory from './inventory';
import signal from './signal';
import technology from './technology';

const router = express.Router();

router.use('/status', status);
router.use('/inventory', inventory);
router.use('/signal', signal);
router.use('/technology', technology);

export default router;
