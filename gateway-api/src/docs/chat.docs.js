module.exports = {
  "/api/chat": {
    post: {
      summary: "Envia uma mensagem para a IA",
      tags: ["Chat"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["message"],
              properties: {
                message: { type: "string", example: "Como eu aprendo a programar?" },
                conversationId: {
                  type: "integer",
                  nullable: true,
                  example: 42,
                  description: "ID de uma conversa existente. Se não informado, uma nova conversa será criada.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Resposta da IA",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  conversationId: { type: "integer", example: 42 },
                  response: { type: "string", example: "Você pode começar aprendendo lógica de programação..." },
                },
              },
            },
          },
        },
        401: { description: "Não autorizado" },
        500: { description: "Erro interno ao processar a mensagem" },
      },
    },
  },
};