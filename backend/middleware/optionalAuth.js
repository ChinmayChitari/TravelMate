const jwt = require('jsonwebtoken');

/**
 * Optional auth: sets req.user if valid token present, else req.user = null.
 * Use for chat/image so we can save tours when logged in but keep offline/guest flow working.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = { id: decoded.id };
    next();
  } catch {
    req.user = null;
    next();
  }
};
