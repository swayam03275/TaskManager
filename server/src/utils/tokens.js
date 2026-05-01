import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const createAccessToken = (payload) => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpires,
  });
};

export const createRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpires,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtAccessSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwtRefreshSecret);
};
