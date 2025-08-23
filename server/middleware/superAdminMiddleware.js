const restrictToSuperAdmin = (req, res, next) => {
  // Assumes `protect` middleware has already run and attached `req.user`
  if (req.user && req.user.isSuperAdmin === 1) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Super admin rights required.' });
  }
};

module.exports = restrictToSuperAdmin;
