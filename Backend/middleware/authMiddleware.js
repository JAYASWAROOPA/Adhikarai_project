// Backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'adhikarai_production_jwt_secret_2026_key';

/**
 * Middleware to verify JWT token and attach user payload to req.user.
 * Identifies logged-in user exclusively from token. Never trusts frontend params.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Access denied. No authentication token provided or invalid format.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach authenticated identity to req.user
    req.user = {
      userId: decoded.userId || decoded.id,
      username: decoded.username || decoded.name,
      email: decoded.email,
      role: (decoded.role || 'citizen').toLowerCase()
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'TokenExpired',
        message: 'Session expired. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'InvalidToken',
      message: 'Invalid authentication token. Signature verification failed.'
    });
  }
};

/**
 * Helper middleware for Role-Based Access Control (RBAC).
 * Enforces permissions for Citizen, Officer, and Admin.
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required before accessing this resource.'
      });
    }

    const normalizedUserRole = req.user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Forbidden: Access restricted. Role '${req.user.role}' is not authorized to perform this action.`
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET
};
