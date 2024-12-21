const { verifyToken } = require("../utils/jwt/token");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Auth token failure." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Access denied. Invalid token." });
  }
};

module.exports = { authenticate };
