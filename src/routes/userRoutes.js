const express = require('express');
const router = express.Router();

const asyncHandler = require('../src/../middlewares/asyncHandler');
const userController = require('../controllers/userController');
const authMiddleware = require('../src/../middlewares/authMiddleware');

router.get(
    '/',
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    asyncHandler(userController.getUsers)
);

router.get(
    '/:id',
    authMiddleware.protect,
    asyncHandler(userController.getUserById)
);

module.exports = router;
