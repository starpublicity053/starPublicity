const superAdminOnly = (req, res, next) => {
  // This middleware runs *after* the 'protect' middleware,
  // so the req.user object (with its role) is available.
  if (req.user && req.user.role === 'superAdmin') {
    next();
  } else {
    res.status(403).json({ message: "Access Denied. Super administrator rights required." });
  }
};

module.exports = superAdminOnly;