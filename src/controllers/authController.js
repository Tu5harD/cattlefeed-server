const User = require("../module/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, "Tushar@0945", {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ userId }, "Tushar@0945", {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Register user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, "Tushar@0945");

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Set new cookies
    res.cookie("access-token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh-token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    if (refreshToken) {
      // Find user and remove refresh token
      await User.findOneAndUpdate(
        { refreshToken },
        { $set: { refreshToken: null } }
      );
    }

    // Clear cookies
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
