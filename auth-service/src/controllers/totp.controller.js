const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { User } = require("../database/models");

const privateKey = fs.readFileSync(path.join(__dirname, "../../keys/private.key"));

// 1. Gera o secret e retorna o QR code para o usuário escanear
async function setupTotp(req, res) {
  try {
    const user = await User.findByPk(req.user.id);

    if (user.totp_enabled) {
      return res.status(400).json({ error: "2FA is already enabled" });
    }

    const secret = speakeasy.generateSecret({
      name: `EduAI (${user.username})`,
      length: 20,
    });

    // Salva o secret temporariamente (ainda não ativado)
    await user.update({ totp_secret: secret.base32 });

    // Gera o QR code para o frontend exibir
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return res.json({ qrCode, secret: secret.base32 });

  } catch (err) {
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
}

// 2. Ativa o 2FA após o usuário confirmar o primeiro código
async function enableTotp(req, res) {
  try {
    const { code } = req.body;
    const user = await User.findByPk(req.user.id);

    if (user.totp_enabled) {
      return res.status(400).json({ error: "2FA is already enabled" });
    }
    if (!user.totp_secret) {
      return res.status(400).json({ error: "2FA setup not started. Call /auth/2fa/setup first" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: code,
      window: 1, // aceita 1 intervalo de tolerância (30s antes/depois)
    });

    if (!isValid) {
      return res.status(401).json({ error: "Invalid code" });
    }

    await user.update({ totp_enabled: true });

    return res.json({ message: "2FA enabled successfully" });

  } catch (err) {
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
}

// 3. Valida o código no login quando 2FA está ativo
async function verifyTotp(req, res) {
  try {
    const { code, userId } = req.body;

    const user = await User.findByPk(userId);
    if (!user || !user.totp_enabled) {
      return res.status(400).json({ error: "2FA is not enabled for this user" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Invalid code" });
    }

    // Código válido — agora sim emite o JWT final
    const token = jwt.sign(
      { id: user.id },
      privateKey,
      { algorithm: "RS256", expiresIn: "1d" }
    );

    return res.json({ token });

  } catch (err) {
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
}

// 4. Desativa o 2FA
async function disableTotp(req, res) {
  try {
    const { code } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user.totp_enabled) {
      return res.status(400).json({ error: "2FA is not enabled" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Invalid code" });
    }

    await user.update({ totp_secret: null, totp_enabled: false });

    return res.json({ message: "2FA disabled successfully" });

  } catch (err) {
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
}

module.exports = { setupTotp, enableTotp, verifyTotp, disableTotp };