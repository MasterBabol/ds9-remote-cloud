import express from 'express';
import os from 'os';

const router = express.Router();

const dbDefaultGlobalAnnouncedSignals = {
    'global-announced-signals': {}
};

const addSignals = (dst, src) => {
    let newDst = Object.assign({}, dst);
    for (var key of Object.keys(src)) {
        if (newDst[key] != undefined) {
            newDst[key] += src[key];
            if (newDst[key] == 0)
                delete newDst[key];
        } else
            newDst[key] = src[key];
    }
    return newDst;
};

const subtractSignals = (dst, src) => {
    let newDst = Object.assign({}, dst);
    for (var key of Object.keys(src)) {
        if (newDst[key] != undefined) {
            newDst[key] -= src[key];
        } else
            newDst[key] = -src[key];
    }
    return newDst;
};

router.get('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    if (le.value()) {
        let leSignals = le.defaults({
            'announced-signals': {}
        }).get('announced-signals').value();
        res.status(200).send(leSignals);
    }
    else
        res.status(404).end();
});

router.post('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    let gsigs = db.defaults(dbDefaultGlobalAnnouncedSignals).get('global-announced-signals');
    if (le.value()) {
        let leSignalsRaw = le.defaults({
            'announced-signals': {}
        }).get('announced-signals');
        let leSignals = leSignalsRaw.value();

        let newSignals = req.body; // {name: count, ...}
        le.set('announced-signals', newSignals).write();
        let subtracted = subtractSignals(newSignals, leSignals);
        let newGsignals = gsigs.value();
        let added = addSignals(newGsignals, subtracted);
        db.set('global-announced-signals', added).write();

        res.status(200).send(newSignals);
    }
    else
        res.status(404).end();
});

router.get('*', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let leGlobalSignals =
        db.defaults(dbDefaultGlobalAnnouncedSignals).get('global-announced-signals');
    res.status(200).send(leGlobalSignals);
});

export default router;
