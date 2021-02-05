const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('testing');
    res.send('Hello Worldddd');
});

module.exports = router;