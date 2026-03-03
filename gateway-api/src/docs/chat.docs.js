module.exports = {
  "/api/chat": {
    post: {
      summary: "Send a message to the AI",
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
                message: { type: "string", example: "How do I learn to code?" },
                conversationId: {
                  type: "integer",
                  nullable: true,
                  example: 42,
                  description: "ID of an existing conversation. If not provided, a new conversation will be created.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "AI response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  conversationId: { type: "integer", example: 42 },
                  response: { type: "string", example: "You can start by learning programming logic..." },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        500: { description: "Internal error while processing the message" },
      },
    },
  },
};