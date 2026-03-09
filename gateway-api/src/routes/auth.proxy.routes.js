const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 7,
  message: { error: "Muitas tentativas de login. Tente novamente mais tarde." },
  standardHeaders: true, // Retorna os headers `RateLimit-*`
  legacyHeaders: false, // Desativa os headers `X-RateLimit-*`
});

// Redireciona /auth/register para o Auth Service
router.post("/register", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
    return res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Auth Service unavailable" };
    return res.status(status).json(data);
  }
});

// Redireciona /auth/login para o Auth Service
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    return res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Auth Service unavailable" };
    return res.status(status).json(data);
  }
});

router.get("/2fa/setup", async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/2fa/setup`, {
      headers: { Authorization: req.headers.authorization }
    });
    return res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Auth Service unavailable" };
    return res.status(status).json(data);
  }
});

router.post("/2fa/enable", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/2fa/enable`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    return res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Auth Service unavailable" };
    return res.status(status).json(data);
  }
});

router.post("/2fa/verify", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/2fa/verify`, req.body);
    return res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Auth Service unavailable" };
    return res.status(status).json(data);
  }
});

router.post("/2fa/disable", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/2fa/disable`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    return res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Auth Service unavailable" };
    return res.status(status).json(data);
  }
});

module.exports = router;