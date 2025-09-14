"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth routes working!',
        timestamp: new Date().toISOString()
    });
});
router.post('/login', (req, res) => {
    res.json({
        success: true,
        message: 'Login endpoint ready for implementation',
        body: req.body
    });
});
exports.default = router;
