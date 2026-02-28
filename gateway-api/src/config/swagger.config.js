const swaggerJsdoc = require("swagger-jsdoc");
const docs = require("../docs");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduAI API Gateway",
      version: "1.0.0",
      description: "Documentação dos endpoints da API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    ...docs,
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);