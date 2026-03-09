const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(path.join(__dirname, "../../keys/public.key"));

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authenticate;