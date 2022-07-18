"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
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
