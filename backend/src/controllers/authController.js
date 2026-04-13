import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database.js";

const buildTokenPayload = (user) => ({
  id: user.id,
  role: user.role,
  name: user.name,
  email: user.email,
});

const setAuthCookie = (res, token) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * =========================
 * SIGNUP (WITH JWT TOKEN)
 * =========================
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // ✅ Check if user already exists
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // ✅ Fetch newly created user (without password)
    const [users] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [result.insertId]
    );

    const newUser = users[0];

    // ✅ Generate JWT Token Immediately After Signup
    const token = jwt.sign(buildTokenPayload(newUser), process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    setAuthCookie(res, token);

    // ✅ Send token + user back
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * =========================
 * LOGIN (JWT)
 * =========================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // ✅ Find user
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = users[0];

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(buildTokenPayload(user), process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Remove password before sending response
    delete user.password;
    setAuthCookie(res, token);

    // ✅ Response
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logout = async (_req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
