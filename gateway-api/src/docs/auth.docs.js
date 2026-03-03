module.exports = {
  "/auth/register": {
    post: {
      summary: "Register a new user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "john_doe" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "User created successfully" },
        400: { description: "Invalid data or username already exists" },
      },
    },
  },

  "/auth/login": {
    post: {
      summary: "Login with username and password",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "john_doe" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
                },
              },
            },
          },
        },
        401: { description: "Invalid credentials" },
      },
    },
  },
};