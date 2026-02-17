const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// URL interna do microserviço FastAPI dentro do Docker
const AI_SERVICE_URL = "http://ai-service:8000";

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Gateway API running" });
});

// Endpoint central: pergunta para IA
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(`${AI_SERVICE_URL}/chat`, {
      message,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao conectar no microserviço de IA",
      details: error.message,
    });
  }
});

// Endpoint central: histórico
app.get("/messages", async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/messages`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar conversa",
      details: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Gateway rodando na porta 3000");
});
