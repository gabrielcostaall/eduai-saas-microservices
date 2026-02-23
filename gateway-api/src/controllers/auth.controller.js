const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../database/models");

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: user.id
    });

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