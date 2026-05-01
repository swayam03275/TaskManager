import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword, verifyPassword } from "../utils/passwords.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  // In production the frontend and backend are often on different domains.
  // sameSite="none" + secure=true is required for cross-site cookies.
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role: "member" });

  const accessToken = createAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });
  const refreshToken = createRefreshToken({ sub: user._id.toString() });
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  setRefreshCookie(res, refreshToken);
  return res.status(201).json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = createAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });
  const refreshToken = createRefreshToken({ sub: user._id.toString() });
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  setRefreshCookie(res, refreshToken);
  return res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.sub);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const matches = await bcrypt.compare(token, user.refreshTokenHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = createAccessToken({
      sub: user._id.toString(),
      role: user.role,
    });
    const refreshToken = createRefreshToken({ sub: user._id.toString() });
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    setRefreshCookie(res, refreshToken);
    return res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const decoded = verifyRefreshToken(token);
      await User.findByIdAndUpdate(decoded.sub, { refreshTokenHash: null });
    } catch (error) {
      // ignore invalid token
    }
  }
  res.clearCookie("refreshToken", cookieOptions);
  return res.json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ user: req.user });
});
