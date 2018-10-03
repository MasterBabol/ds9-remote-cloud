import express from 'express';
import os from 'os';
import serverStatus from './serverStatus';
import factorioImage from './factorioImage';

const router = express.Router();

router.get('/', (req, res) => {
    let apiList = {
        serverStatus: serverStatus.verb,
        factorioImage: factorioImage.verb
    };
    res.send(apiList);
});

router.use('/serverStatus', serverStatus.router);
router.use('/factorioImage', factorioImage.router);

export default router;
