const jwt = require("jsonwebtoken");
const axios = require("axios");

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

let publicKey = null;

// Busca a chave pública do Auth Service uma única vez na inicialização
async function loadPublicKey() {
  try {
    const res = await axios.get(`${AUTH_SERVICE_URL}/auth/public-key`);
    publicKey = res.data.publicKey;
    console.log("Public key loaded from Auth Service");
  } catch (err) {
    console.error("Failed to load public key from Auth Service:", err.message);
    process.exit(1); // Não faz sentido continuar sem a chave
  }
}

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

module.exports = { authenticate, loadPublicKey };