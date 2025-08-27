const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed

const protect = async (req, res, next) => {
  let token;

  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Get token from header
    token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token, but exclude the password
    const userFromDb = await User.findById(decoded.id).select("-password");

    if (!userFromDb) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // Standardize role checks.
    const isSuperAdmin = userFromDb.isSuperAdmin === 1;
    const isAdmin = userFromDb.isAdmin === 1;

    // Ensure the user has at least admin privileges for any protected route
    if (!isAdmin && !isSuperAdmin) {
      return res.status(403).json({ message: "Access Denied: Administrator privileges required." });
    }

    // Attach a standardized user object to the request
    req.user = {
      ...userFromDb.toObject(),
      role: isSuperAdmin ? "superAdmin" : "admin",
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Not authorized, token expired" });
    }
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const superAdminOnly = (req, res, next) => {
  // This middleware should run *after* the 'protect' middleware,
  // so req.user will be available and standardized.
  if (req.user?.role === 'superAdmin') {
    next();
  } else {
    res.status(403).json({ message: "Access Denied. Super administrator rights required." });
  }
};

module.exports = protect;
module.exports.superAdminOnly = superAdminOnly;