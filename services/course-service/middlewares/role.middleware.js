module.exports = function allowRoles(roles = []) {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(401).json({ message: 'Unauthenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
