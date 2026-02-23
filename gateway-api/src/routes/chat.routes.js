const express = require("express");
const { chat, getMessages } = require("../controllers/chat.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/chat", authenticate, chat);
router.get("/conversations/:conversationId/messages", authenticate, getMessages);

module.exports = router;