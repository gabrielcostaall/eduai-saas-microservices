const { Conversation, Message } = require("../database/models");
const { generateResponse } = require("../services/ai.service");
require("dotenv").config();

async function chat(req, res) {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        where: { id: conversationId, user_id: userId }
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
    } else {
      conversation = await Conversation.create({ user_id: userId });
    }

    // Salva mensagem do usuário
    await Message.create({
      conversation_id: conversation.id,
      role: "user",
      content: message
    });

    // Busca histórico da conversa
    const history = await Message.findAll({
      where: { conversation_id: conversation.id },
      order: [["created_at", "ASC"]]
    });
    const systemPrompt = {
      role: "system",
      content: process.env.AI_SYSTEM_PROMPT || "Responda de forma clara e objetiva."
    };

    // Formata para AI Service
    const formattedMessages = [
        systemPrompt,
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Chama AI Service
    let answer;
    let status;
    try {
      answer = await generateResponse(formattedMessages);
      } catch (err) {
        console.error("Erro na IA:", err.message);

        answer = "A resposta não pôde ser gerada no momento.";
        status = "error";
    }

    // Salva resposta
    await Message.create({
      conversation_id: conversation.id,
      role: "assistant",
      content: answer,
      status: status || "success"
    });

    return res.json({
      conversationId: conversation.id,
      response: answer
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getMessages(req, res) {
  const userId = req.user.id;
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    where: { id: conversationId, user_id: userId }
  });

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const messages = await Message.findAll({
    where: { conversation_id: conversation.id },
    order: [["created_at", "ASC"]]
  });

  return res.json(messages);
}

async function getConversations(req, res) {
  try {
    const userId = req.user.id;
  
    const conversations = await Conversation.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      attributes: ["id", "created_at"],
      include: [{
        model: Message,
        as: "Messages",
        limit: 1,
        order: [["created_at", "DESC"]],
        attributes: ["content", "role", "created_at"],
        separate: true
      }]
    });
  
    const formattedConversations = conversations.map(conv => ({
      id: conv.id,
      created_at: conv.created_at,
      last_message: conv.Messages[0] || null
    }));
  
  
    return res.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { chat, getMessages, getConversations };