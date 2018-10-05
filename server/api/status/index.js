import express from 'express';
import os from 'os';

const router = express.Router();

const dbDefaultLastStatus = {
    'last-status': {
        'discovered-time': 0,
        'online': false,
        'cpuUse%': -1,
        'memUse%': -1,
        'memTotalMB': -1
    }
}

router.get('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    if (le.value()) {
        let leLastStatus = le.defaults(dbDefaultLastStatus).get('last-status').value();
        if (leLastStatus['discovered-time'] + 30 * 1000 < new Date().getTime())
            leLastStatus = dbDefaultLastStatus['last-status'];
        res.status(200).send(leLastStatus);
    } else
        res.status(404).end();
});

router.post('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    if (le.value()) {
        let newStatus = dbDefaultLastStatus['last-status'];
        newStatus['discovered-time'] = new Date().getTime();
        newStatus['online'] = true;
        let cpuUse = req.body['cpuUse%'];
        newStatus['cpuUse%'] = (cpuUse)?cpuUse:-1;
        let memUse = req.body['memUse%'];
        newStatus['memUse%'] = (memUse)?memUse:-1;
        let memTotalMB = req.body['memTotalMB'];
        newStatus['memTotalMB'] = (memTotalMB)?memTotalMB:-1;
        le.set('last-status', newStatus).write();
        res.status(200).end();
    } else
        res.status(404).end();
});

router.get('*', (req, res) => {
    let cpuAvg = os.loadavg();
    let cpuAvg60s = cpuAvg[0];
    let memTotal = os.totalmem();
    let memFree = os.freemem();

    let serverStatus = {
        'cpuUse%': Number((100 * cpuAvg60s).toFixed(1)),
        'memUse%': Number((100 * (memTotal - memFree) / memTotal).toFixed(1)),
        'memTotalMB': Math.floor(memTotal / 1024 / 1024)
    };

    res.status(200).send(serverStatus);
});

router.post('*', (req, res) => {
    res.status(405).end();
});

export default router;
