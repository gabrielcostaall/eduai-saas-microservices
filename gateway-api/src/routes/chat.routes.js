const express = require("express");
const { chat, getMessages, getConversations, deleteConversation } = require("../controllers/chat.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/chat", authenticate, chat);
router.get("/conversations/:conversationId/messages", authenticate, getMessages);
router.get("/conversations", authenticate, getConversations);
router.delete("/conversations/:conversationId", authenticate, deleteConversation);

module.exports = router;