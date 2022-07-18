import express, { Express, Request, Response } from 'express';
var router = express.Router();

router.get('/', function (req: Request, res: Response) {
    res.send('test 3');
});

router.post('/connect', function (req: Request, res: Response) {
    res.send('POST route on things.');
});

router.post('/update', function (req: Request, res: Response) {
    res.send('POST route on things.');
});

//export this router to use in our index.js
module.exports = router;
