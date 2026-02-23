const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

async function generateResponse(messages) {
  const response = await axios.post(`${AI_SERVICE_URL}/generate`, {
    messages
  });

  return response.data.answer;
}

module.exports = { generateResponse };