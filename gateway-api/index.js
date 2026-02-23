require("dotenv").config();

const express = require("express");
const cors = require("cors");

const chatRoutes = require("./src/routes/chat.routes");
const authRoutes = require("./src/routes/auth.routes");
const { sequelize } = require("./src/database/models");

const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ status: "Gateway API running" });
});


app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log("Banco conectado com sucesso");

    app.listen(PORT, () => {
      console.log(`Gateway rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar no banco:", err);
  });