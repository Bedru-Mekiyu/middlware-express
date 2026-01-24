const express = require('express');
const router = express.Router();

const asyncHandler = require('../middlewares/asyncHandler');
const userController = require('../controllers/userController');

router.get('/', asyncHandler(userController.getUsers));
router.get('/:id', asyncHandler(userController.getUserById));

module.exports = router;
