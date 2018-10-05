import express from 'express';
import validator from 'validator';

const router = express.Router();

router.get('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    if (le.value())
        res.status(200).end();
    else
        res.status(404).end();
});

router.post('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let les = db.get('local-estates');
    let le = les.find({ id: leId });
    if (le.value())
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
            
            res.status(200).end();
        } catch (e) {
            if (isNaN(e))
                res.status(500).end();
            else
                res.status(e).end();
        }
    }
});

router.delete('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let les = db.get('local-estates');
    let le = les.find({ id: leId });
    if (le.value()) {
        try {
            let leAccessToken = req.body.accessToken;

            if (!leAccessToken)
                throw 400;
            if (leAccessToken != le.value()['accessToken'])
                throw 403;

            les.remove({ id: leId }).write();
            
            res.status(200).end();
        } catch (e) {
            if (isNaN(e))
                res.status(500).end();
            else
                res.status(e).end();
        }
    } else
        res.status(404).end();
});

export default router;
