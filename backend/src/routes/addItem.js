const db = require('../persistence');
const crypto = require('crypto');

module.exports = async (req, res) => {
    const item = {
        id: crypto.randomUUID(),
        name: req.body.name,
        completed: false,
    };

    await db.storeItem(item);
    res.send(item);
};
