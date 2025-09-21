import jwt from 'jsonwebtoken';
import loadEnv from './loadEnv.js';

loadEnv();
const SECRET = process.env.JWT_SECRET;

export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
