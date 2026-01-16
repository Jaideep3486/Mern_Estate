import { errorHandler } from './error.js';
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // Extracting token from cookies
  if (!token) {
    return next(errorHandler(401, 'You are not authenticated!'));
  }
  // If token is not present, return an authentication error
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Forbidden!'));
    }
    req.user = user;
    next();
  });
};
