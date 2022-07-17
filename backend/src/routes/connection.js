var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('test 3');
});

router.post('/connect', function (req, res) {
    res.send('POST route on things.');
});

router.post('/update', function (req, res) {
    res.send('POST route on things.');
});

//export this router to use in our index.js
module.exports = router;
