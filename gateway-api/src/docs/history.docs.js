module.exports = {
  "/api/chat/conversations": {
    get: {
      summary: "Lista todas as conversas do usuário autenticado",
      tags: ["Histórico"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de conversas",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    createdAt: { type: "string", format: "date-time" },
                    Messages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer", example: 10 },
                          role: { type: "string", enum: ["user", "assistant"] },
                          content: { type: "string", example: "Como eu aprendo a programar?" },
                          created_at: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Não autorizado" },
      },
    },
  },

  "/api/chat/conversations/{id}/messages": {
    get: {
      summary: "Retorna todas as mensagens de uma conversa",
      tags: ["Histórico"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "ID da conversa",
        },
      ],
      responses: {
        200: {
          description: "Lista de mensagens da conversa",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 10 },
                    role: { type: "string", enum: ["user", "assistant"] },
                    content: { type: "string", example: "Como eu aprendo a programar?" },
                    created_at: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
        401: { description: "Não autorizado" },
        404: { description: "Conversa não encontrada" },
      },
    },
  },

  "/api/chat/conversations/{id}": {
    delete: {
      summary: "Deleta uma conversa",
      tags: ["Histórico"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "ID da conversa a ser deletada",
        },
      ],
      responses: {
        200: { description: "Conversa deletada com sucesso" },
        401: { description: "Não autorizado" },
        404: { description: "Conversa não encontrada" },
      },
    },
  },
};