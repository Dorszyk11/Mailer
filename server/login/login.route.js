const express = require('express');
const router = express.Router();
const loginService = require('./service');

router.post('/api/admin/login', loginService.adminLogin);

module.exports = router;
