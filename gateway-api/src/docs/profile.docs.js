module.exports = {
  "/api/users/profile": {
    get: {
      summary: "Return the authenticated user's data",
      tags: ["Profile"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Profile data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "john_doe" },
                  createdAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },

    put: {
      summary: "Update the authenticated user's password",
      tags: ["Profile"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["password"],
              properties: {
                password: { type: "string", example: "newPassword456" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Password updated successfully" },
        400: { description: "Invalid data" },
        401: { description: "Unauthorized" },
      },
    },
  },
};