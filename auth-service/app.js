require("dotenv").config();
const express = require("express");
const authRoutes = require("./src/routes/auth.routes");
const totpRoutes = require("./src/routes/totp.routes");
const { sequelize } = require("./src/database/models");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/auth/2fa", totpRoutes);

sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    console.log("Database connected successfully");
    console.log(`Auth Service running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Error connecting to the database:", err);
  process.exit(1);
});

module.exports = app;