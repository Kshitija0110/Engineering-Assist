const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, chatController.createChat);
router.put('/:id', verifyToken, chatController.renameChat);
router.delete('/:id', verifyToken, chatController.deleteChat);
router.post('/:id/messages', verifyToken, chatController.sendMessage);
router.get('/', verifyToken, chatController.getChats);
router.get('/:id/messages', verifyToken, chatController.getMessages);

module.exports = router;