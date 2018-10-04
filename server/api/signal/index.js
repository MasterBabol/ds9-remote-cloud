import express from 'express';
import os from 'os';

const router = express.Router();

router.get('*', (req, res) => {
    res.status(200).send();
});

router.post('*', (req, res) => {
    res.status(200).end();
});

export default router;
