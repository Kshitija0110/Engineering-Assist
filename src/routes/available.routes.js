const express = require('express');
const router = express.Router();
const availableController = require('../controllers/available.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/colleges',verifyToken, availableController.addCollege);
router.post('/textbooks',verifyToken, availableController.addTextbook);
router.get('/colleges',verifyToken, availableController.getColleges);
router.get('/textbooks',verifyToken, availableController.getTextbooks);

module.exports = router;