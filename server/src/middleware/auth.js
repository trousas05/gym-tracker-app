const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes that require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if authorization header exists and starts with Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in. Please log in to access this resource.",
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists.",
      });
    }
    
    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token. Please log in again.",
    });
  }
};

// Middleware to restrict access to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }
    
    next();
  };
};