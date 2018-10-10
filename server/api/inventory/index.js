import express from 'express';
import os from 'os';

const router = express.Router();

const dbDefaultInventory = {
    'inventory': {}
}

router.get('*', (req, res) => {
    let db = req.db.read();
    let globalInv = db.defaults(dbDefaultInventory).get('inventory').value();

    res.status(200).send(globalInv);
});

router.post('*', (req, res) => {
    let db = req.db.read();
    let globalInv = db.defaults(dbDefaultInventory).get('inventory');

    try {
        let invReq = req.body.items;
        if (invReq)
        {
            let applies = {};
            let dbmods = [];
            for (var itemName in invReq) {
                let count = invReq[itemName];
                let defaultItem = {}
                defaultItem[itemName] = 0;
                let have = globalInv.defaults(defaultItem).get(itemName);

                let newCount = have.value() + count;
                if (newCount < 0) {
                    if ('nonexact' in req.query) {
                        applies[itemName] = -have.value();
                        dbmods.push(globalInv.unset(itemName));
                    } else
                        throw 404;
                }
                else {
                    applies[itemName] = count;
                    if (newCount > 0)
                        dbmods.push(globalInv.set(itemName, newCount));
                    else
                        dbmods.push(globalInv.unset(itemName));
                }
            }

            for (var dbmod of dbmods)
                dbmod.write();

            res.status(200).send(applies);
        } else
            throw 400;
    } catch (e) {
        if (isNaN(e)) {
            res.status(500).end();
            console.log(e);
        }
        else
            res.status(e).end();
    }
});

export default router;
