const express = require("express");
const { chat, getMessages, getConversations } = require("../controllers/chat.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/chat", authenticate, chat);
router.get("/conversations/:conversationId/messages", authenticate, getMessages);
router.get("/conversations", authenticate, getConversations);

module.exports = router;