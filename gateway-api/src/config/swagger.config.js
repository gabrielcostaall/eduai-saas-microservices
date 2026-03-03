const swaggerJsdoc = require("swagger-jsdoc");
const docs = require("../docs");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduAI API Gateway",
      version: "1.1.0",
      description: "API endpoint documentation",
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