require("dotenv").config();

const express = require("express");
const cors = require("cors");

const chatRoutes = require("./src/routes/chat.routes");
const authProxyRoutes = require("./src/routes/auth.proxy.routes");
const userRoutes = require("./src/routes/user.routes");
const { sequelize } = require("./src/database/models");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger.config");
const { loadPublicKey } = require("./src/middlewares/auth.middleware");

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req, res) => {
  res.json({ status: "Gateway API running" });
});


app.use("/api/auth", authProxyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);


const PORT = process.env.PORT || 3000;

sequelize.authenticate().then(() => loadPublicKey().then(() => {
  app.listen(PORT, () => {
    console.log("Banco conectado com sucesso");
    console.log(`Gateway rodando na porta ${PORT}`);
  });
})).catch((err) => {
  console.error("Erro ao conectar no banco:", err);
  process.exit(1);
});

module.exports = app;