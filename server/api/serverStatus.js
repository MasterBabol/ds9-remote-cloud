import express from 'express';
import os from 'os';

const router = express.Router();

router.get('*', (req, res, next) => {
    let cpuAvg = os.loadavg();
    let cpuAvg60s = cpuAvg[0];
    let memTotal = os.totalmem();
    let memFree = os.freemem();

    let serverInfo = {
        'cpuUse%': Number((100 * cpuAvg60s).toFixed(3)),
        'memUse%': Number((100 * (memTotal - memFree) / memTotal).toFixed(3)),
        'memTotalMB': Math.floor(memTotal / 1024 / 1024)
    };
    res.send(serverInfo);
});

const verb = ['get'];

const ds9api = {
    router,
    verb
};

export default ds9api;
