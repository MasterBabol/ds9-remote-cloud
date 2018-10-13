import express from 'express';
import os from 'os';
import sigops from './sigops';

const router = express.Router();

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
    let gsigs = db.defaults(sigops.dbDefaultGlobalAnnouncedSignals).get('global-announced-signals');
    if (le.value()) {
        let leSignalsRaw = le.defaults({
            'announced-signals': {}
        }).get('announced-signals');
        let leSignals = leSignalsRaw.value();

        let newSignals = req.body; // {name: count, ...}
        le.set('announced-signals', newSignals).write();
        let subtracted = sigops.subtractSignals(newSignals, leSignals);
        let newGsignals = gsigs.value();
        let added = sigops.addSignals(newGsignals, subtracted);
        db.set('global-announced-signals', added).write();

        res.status(200).send(subtracted);
    }
    else
        res.status(404).end();
});

router.get('*', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let leGlobalSignals =
        db.defaults(sigops.dbDefaultGlobalAnnouncedSignals).get('global-announced-signals');
    res.status(200).send(leGlobalSignals);
});

export default router;
