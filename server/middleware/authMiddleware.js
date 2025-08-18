// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const protect = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superAdmin")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};


module.exports = { verifyToken ,protect };
