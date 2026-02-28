module.exports = {
  "/api/users/profile": {
    get: {
      summary: "Retorna os dados do usuário autenticado",
      tags: ["Profile"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Dados do perfil",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "joao_silva" },
                  createdAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        401: { description: "Não autorizado" },
      },
    },

    put: {
      summary: "Atualiza a senha do usuário autenticado",
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
                password: { type: "string", example: "novaSenha456" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Senha atualizada com sucesso" },
        400: { description: "Dados inválidos" },
        401: { description: "Não autorizado" },
      },
    },
  },
};