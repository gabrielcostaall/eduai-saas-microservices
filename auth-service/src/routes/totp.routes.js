const express = require("express");
const { setupTotp, enableTotp, verifyTotp, disableTotp } = require("../controllers/totp.controller");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/setup", authenticate, setupTotp);       // Gera QR code
router.post("/enable", authenticate, enableTotp);    // Ativa o 2FA
router.post("/verify", verifyTotp);                  // Valida código no login (sem auth, pois ainda não tem JWT)
router.post("/disable", authenticate, disableTotp);  // Desativa o 2FA

module.exports = router;