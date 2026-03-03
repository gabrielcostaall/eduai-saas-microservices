const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Conversation, Message } = require("../database/models");

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    if (!password || password.length < 10 || password.length > 30) {
      return res.status(400).json({ error: "Password must be at least 10 characters long and no more than 30 characters long" });
    }
    if (!username || username.length < 7 || username.length > 20) {
      return res.status(400).json({ error: "Username must be between 7 and 20 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword
    });


    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });

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

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // If the user is a recruiter, we delete all their conversations and messages to start fresh on each login
    if (username === "Recruiter") {
    const conversations = await Conversation.findAll({
      where: { user_id: user.id }
    });

    const conversationIds = conversations.map(c => c.id);

    if (conversationIds.length > 0) {
      await Message.destroy({ where: { conversation_id: conversationIds } });
      await Conversation.destroy({ where: { user_id: user.id } });
    }
   }
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });

  } catch (err) {
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
}


module.exports = { register, login };