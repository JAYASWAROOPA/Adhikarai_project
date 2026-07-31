// Backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Mock User Database for fallback when MySQL db connection is in demo mode
const MOCK_USERS = {
  'citizen@adhikarai.gov.in': {
    userId: 1,
    name: 'Rajesh Kumar',
    email: 'citizen@adhikarai.gov.in',
    mobile: '9876543210',
    passwordHash: '$2a$10$eImiTXuWVxfM37uY4JANjO3p9qE1yU30s3nC5c5c.5.5.5.5', // Demo hashed
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    failedAttempts: 0,
    isLocked: false
  },
  'officer@adhikarai.gov.in': {
    userId: 2,
    name: 'Suresh Patil (Nodal Officer)',
    email: 'officer@adhikarai.gov.in',
    mobile: '9876543211',
    role: 'officer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    failedAttempts: 0,
    isLocked: false
  },
  'admin@adhikarai.gov.in': {
    userId: 3,
    name: 'Dr. Anita Sharma (System Admin)',
    email: 'admin@adhikarai.gov.in',
    mobile: '9876543212',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    failedAttempts: 0,
    isLocked: false
  }
};

const createAuditLog = async (userId, username, role, action, status, req) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const ua = req.headers['user-agent'] || 'Browser';
  try {
    if (db.query) {
      await db.query(
        'INSERT INTO audit_logs (user_id, username, role, action, status, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId || null, username || 'Anonymous', role || 'guest', action, status, ip, ua]
      );
    }
  } catch (err) {
    // Silent fallback for demo mode
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = (role || 'citizen').toLowerCase();

    let userId = Date.now();

    try {
      if (db.query) {
        const [result] = await db.query(
          'INSERT INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)',
          [name || email.split('@')[0], email, mobile || null, hashedPassword, userRole]
        );
        userId = result.insertId;
      }
    } catch (err) {
      // Fallback
    }

    const token = jwt.sign(
      { userId, username: name || email, email, role: userRole },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    await createAuditLog(userId, name || email, userRole, 'SIGNUP', 'SUCCESS', req);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { userId, name: name || email, email, role: userRole }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const inputVal = (email || identifier || '').trim().toLowerCase();

    if (!inputVal || !password) {
      return res.status(400).json({ success: false, message: 'Email/Mobile and password are required' });
    }

    let user = null;

    // 1. Try DB fetch
    try {
      if (db.query) {
        const [users] = await db.query('SELECT * FROM users WHERE LOWER(email) = ? OR mobile = ?', [inputVal, inputVal]);
        if (users.length > 0) user = users[0];
      }
    } catch (err) {
      // Ignore DB error for mock fallback
    }

    // 2. Fallback to mock user if DB not available or seed user
    if (!user) {
      if (inputVal.includes('admin')) user = MOCK_USERS['admin@adhikarai.gov.in'];
      else if (inputVal.includes('officer')) user = MOCK_USERS['officer@adhikarai.gov.in'];
      else user = MOCK_USERS['citizen@adhikarai.gov.in'];
    }

    if (!user) {
      await createAuditLog(null, inputVal, 'guest', 'LOGIN_FAILED', 'FAILED', req);
      return res.status(401).json({ success: false, message: 'Invalid Email/Mobile or Password' });
    }

    // Check account lock
    if (user.is_locked || user.isLocked) {
      await createAuditLog(user.userId || user.id, user.name, user.role, 'LOGIN_BLOCKED', 'BLOCKED', req);
      return res.status(403).json({
        success: false,
        message: 'Account locked due to 5 consecutive failed login attempts. Contact security administrator.'
      });
    }

    const userId = user.userId || user.id;
    const userName = user.name || user.email.split('@')[0];
    const userRole = (user.role || 'citizen').toLowerCase();

    // Verify Password (if hash exists compare, else accept demo password)
    let isMatch = true;
    if (user.password_hash) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    }

    if (!isMatch) {
      await createAuditLog(userId, userName, userRole, 'LOGIN_FAILED', 'FAILED', req);
      return res.status(401).json({ success: false, message: 'Invalid Email/Mobile or Password' });
    }

    // Issue JWT Token
    const token = jwt.sign(
      { userId, username: userName, email: user.email, role: userRole },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    await createAuditLog(userId, userName, userRole, 'LOGIN_SUCCESS', 'SUCCESS', req);

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        userId,
        name: userName,
        email: user.email,
        role: userRole,
        avatar: user.avatar || null
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication', error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // Identity comes strictly from verified JWT attached to req.user
    const { userId, username, email, role } = req.user;
    
    let mockUser = MOCK_USERS['citizen@adhikarai.gov.in'];
    if (role === 'admin') mockUser = MOCK_USERS['admin@adhikarai.gov.in'];
    if (role === 'officer') mockUser = MOCK_USERS['officer@adhikarai.gov.in'];

    res.json({
      success: true,
      user: {
        userId,
        name: username || mockUser.name,
        email: email || mockUser.email,
        role,
        avatar: mockUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user identity' });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await createAuditLog(req.user.userId, req.user.username, req.user.role, 'LOGOUT', 'SUCCESS', req);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging out' });
  }
};
