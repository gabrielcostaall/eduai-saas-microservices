module.exports = {
  "/api/chat/conversations": {
    get: {
      summary: "List all conversations of the authenticated user",
      tags: ["History"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "List of conversations",
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
                          content: { type: "string", example: "How do I learn to code?" },
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
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/chat/conversations/{id}/messages": {
    get: {
      summary: "Return all messages from a conversation",
      tags: ["History"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Conversation ID",
        },
      ],
      responses: {
        200: {
          description: "List of messages from the conversation",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 10 },
                    role: { type: "string", enum: ["user", "assistant"] },
                    content: { type: "string", example: "How do I learn to code?" },
                    created_at: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        404: { description: "Conversation not found" },
      },
    },
  },

  "/api/chat/conversations/{id}": {
    delete: {
      summary: "Delete a conversation",
      tags: ["History"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "ID of the conversation to delete",
        },
      ],
      responses: {
        200: { description: "Conversation deleted successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Conversation not found" },
      },
    },
  },
};