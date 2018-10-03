import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
    let t = req.query['t'];
    if (t != undefined)
    {
        res.send(t);
    }
    else
        res.status(400).end();
});

const verb = ['get'];

const ds9api = {
    router,
    verb
};

export default ds9api;
