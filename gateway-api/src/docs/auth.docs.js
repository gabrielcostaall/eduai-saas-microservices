module.exports = {
  "/auth/register": {
    post: {
      summary: "Registro de novo usuário",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "joao_silva" },
                password: { type: "string", example: "senha123" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Usuário criado com sucesso" },
        400: { description: "Dados inválidos ou username já existe" },
      },
    },
  },

  "/auth/login": {
    post: {
      summary: "Login com username e senha",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "joao_silva" },
                password: { type: "string", example: "senha123" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login realizado com sucesso",
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
        401: { description: "Credenciais inválidas" },
      },
    },
  },
};