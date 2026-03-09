const express = require("express");
const { register, login, getPublicKey, getMe } = require("../controllers/auth.controller");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/public-key", getPublicKey);
router.get("/me", authenticate, getMe);

module.exports = router;