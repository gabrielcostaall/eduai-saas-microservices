const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { User, Conversation, Message } = require("../database/models");

const privateKey = fs.readFileSync(path.join(__dirname, "../../keys/private.key"));
const publicKey = fs.readFileSync(path.join(__dirname, "../../keys/public.key"));

function getPublicKey(req, res) {
  return res.json({ publicKey: publicKey.toString() });
}

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || username.length < 7 || username.length > 20) {
      return res.status(400).json({ error: "Username must be between 7 and 20 characters long" });
    }
    if (!password || password.length < 10 || password.length > 30) {
      return res.status(400).json({ error: "Password must be at least 10 characters long and no more than 30 characters long" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hash = await argon2.hash(password,{ timeCost: 3, memoryCost: 65536, parallelism: 4 });
    const user = await User.create({ username, password: hash });

    const token = jwt.sign(
      { id: user.id },
      privateKey,
      { algorithm: "RS256", expiresIn: "1d" }
    );

    return res.status(201).json({ token });

  } catch (err) {
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const MAX_ATTEMPTS = 14;
    const LOCK_TIME = 60 * 60 * 1000; // 60 minutos

    if (user.locked_until && user.locked_until > new Date()) {
      const remaining = Math.ceil((user.locked_until - new Date()) / 1000);
      return res.status(403).json({ error: `Account locked. Try again in ${remaining} seconds` });
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      const attempts = (user.failed_attempts || 0) + 1;
      const updates = { failed_attempts: attempts };

      if (attempts >= MAX_ATTEMPTS) {
        updates.locked_until = new Date(Date.now() + LOCK_TIME);
        updates.failed_attempts = 0; // reseta contagem de tentativas após bloquear
      }
      await user.update(updates);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (username === "Recruiter") {
      const conversations = await Conversation.findAll({ where: { user_id: user.id } });
      const conversationIds = conversations.map(c => c.id);

      if (conversationIds.length > 0) {
        await Message.destroy({ where: { conversation_id: conversationIds } });
        await Conversation.destroy({ where: { user_id: user.id } });
      }
    }

    // Se 2FA estiver ativo, não retorna o JWT ainda
    // Retorna um indicador para o frontend pedir o código
    if (user.totp_enabled) {
      return res.json({
        requiresTwoFactor: true,
        userId: user.id, // frontend usa para chamar /auth/2fa/verify
      });
    }

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

module.exports = { register, login, getPublicKey };