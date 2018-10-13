import express from 'express';
import validator from 'validator';
import sigops from '../signal/sigops';

const router = express.Router();

router.get('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    let leInfoRaw = le.value();
    if (leInfoRaw) {
        res.status(200).send({});
    }
    else
        res.status(404).end();
});

router.post('/:id', (req, res) => {
    if (req.auth.type != 'user') {
        res.status(403).end();
        return;
    }
    let db = req.db.read();
    let leId = req.params.id;
    let les = db.get('local-estates');
    let le = les.find({ id: leId });
    let users = db.get('users');
    let user = users.find({ id: leId });
    if (le.value() || user.value())
        res.status(409).end();
    else {
        try {
            let leAccessToken = req.body.accessToken;
            let leType = req.body.type;

            if (!validator.isWhitelisted(leId,
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-') ||
                !leAccessToken || !leType
            )
                throw 400;

            let newLe = {
                'id': leId,
                'accessToken': leAccessToken,
                'type': leType
            }

            les.push(newLe).write();

            res.status(200).send({});
        } catch (e) {
            if (isNaN(e))
                res.status(500).end();
            else
                res.status(e).end();
        }
    }
});

router.delete('/:id', (req, res) => {
    if (req.auth.type != 'user') {
        res.status(403).end();
        return;
    }
    let db = req.db.read();
    let leId = req.params.id;
    let les = db.get('local-estates');
    let le = les.find({ id: leId });
    if (le.value()) {
        try {
            let gsigs = db.defaults({ 'global-announced-signals': {} }).get('global-announced-signals');
            let leSignalsRaw = le.defaults({ 'announced-signals': {} }).get('announced-signals');
            let leSignals = leSignalsRaw.value();

            let subtracted = sigops.subtractSignals(gsigs.value(), leSignals);
            db.set('global-announced-signals', subtracted).write();

            les.remove({ id: leId }).write();

            res.status(200).end({});
        } catch (e) {
            if (isNaN(e))
                res.status(500).end();
            else
                res.status(e).end();
        }
    } else
        res.status(404).end();
});

router.get('*', (req, res) => {
    let db = req.db.read();
    let les = db.get('local-estates').value();
    let lesInfo = [];
    if (les) {
        for (var le of les) {
            lesInfo.push(le.id);
        }
    }
    res.status(200).send(lesInfo);
});

export default router;
