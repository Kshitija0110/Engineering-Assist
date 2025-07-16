const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/isadmin', verifyToken, authController.checkAdmin);
router.post('/google', authController.google);

module.exports = router;