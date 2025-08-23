const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token, but exclude the password
      const userFromDb = await User.findById(decoded.id).select('-password');

      if (!userFromDb) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Check for both casings to be robust against manual DB entry errors.
      const isSuper = userFromDb.isSuperAdmin == 1 || userFromDb.isSuperadmin == 1;
      const isAdmin = userFromDb.isAdmin == 1;

      // NEW: Add a check to ensure the user has admin rights for any protected route.
      if (!isAdmin && !isSuper) {
        return res.status(403).json({ message: 'Access Denied: You do not have administrator privileges.' });
      }

      // Attach a complete user object to the request, ensuring role is explicitly set from fresh DB data.
      req.user = userFromDb.toObject();
      // We already know the user is at least an admin, so no need to check for 'user' role here.
      req.user.role = isSuper ? 'superAdmin' : 'admin';
      req.user.isSuperAdmin = isSuper ? 1 : 0;
      req.user.isAdmin = isAdmin ? 1 : 0;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const superAdminOnly = (req, res, next) => {
  // This middleware should run *after* the 'protect' middleware,
  // so req.user will be available.
  const isSuper = req.user && (req.user.isSuperAdmin === 1 || req.user.isSuperadmin === 1);

  if (isSuper) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied. Super administrator rights required.' });
  }
};

// The main export is the `protect` function for backward compatibility.
module.exports = protect;
// The `superAdminOnly` function is attached as a property.
module.exports.superAdminOnly = superAdminOnly;