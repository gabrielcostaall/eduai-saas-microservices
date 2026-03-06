const express = require("express");
const axios = require("axios");

const router = express.Router();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

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
router.post("/login", async (req, res) => {
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