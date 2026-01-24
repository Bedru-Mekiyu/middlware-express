const express = require('express');
const router = express.Router();

const asyncHandler = require('../src/../middlewares/asyncHandler');
const authController = require('../src/../controllers/authController');

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));

module.exports = router;
