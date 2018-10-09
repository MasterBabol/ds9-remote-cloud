import express from 'express';
import os from 'os';
import _ from 'lodash';

const router = express.Router();

const dbDefaultGlobalResearches = {
    'global-researches': {}
};

const mergeTechnologies = (dst, src) => {
    let newDst = _.cloneDeep(dst);
    for (var key of Object.keys(src)) {
        if (newDst[key] != undefined) {
            let res = newDst[key];
            if (res.researched == false)
                res.researched = src[key].researched;
            if (res.level < src[key].level)
                res.level = src[key].level;
        } else {
            newDst[key] = {
                researched: src[key].researched,
                level: src[key].level
            };
        }
    }
    return newDst;
};

router.get('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    if (le.value()) {
        let leResearches = le.defaults({
            'researches': {}
        }).get('researches').value();
        res.status(200).send(leResearches);
    }
    else
        res.status(404).end();
});

router.post('/:id', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let le = db.get('local-estates').find({ id: leId });
    let gsigs = db.defaults(dbDefaultGlobalResearches).get('global-researches');
    if (le.value()) {
        let leResearchesRaw = le.defaults({
            'researches': {}
        }).get('researches');
        let leResearches = leResearchesRaw.value();

        let newResearches = req.body;
        le.set('researches', newResearches).write();
        let mergedResearches = mergeTechnologies(gsigs.value(), newResearches);
        db.set('global-researches', mergedResearches).write();

        res.status(200).end();
    }
    else
        res.status(404).end();
});

router.get('*', (req, res) => {
    let db = req.db.read();
    let leId = req.params.id;
    let leGlobalResearches = 
        db.defaults(dbDefaultGlobalResearches).get('global-researches');
    res.status(200).send(leGlobalResearches.value());
});

export default router;
