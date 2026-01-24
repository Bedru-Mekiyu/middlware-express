const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { registerValidation, loginValidation } = require('../validators/authValidator');


const asyncHandler = require('../src/../middlewares/asyncHandler');
const authController = require('../src/../controllers/authController');

router.post(
    '/register',
    registerValidation,
    validate,
    asyncHandler(authController.register)
);

router.post(
    '/login',
    loginValidation,
    validate,
    asyncHandler(authController.login)
);

router.post('/refresh', asyncHandler(authController.refreshToken));
router.post('/logout', asyncHandler(authController.logout));

module.exports = router;
