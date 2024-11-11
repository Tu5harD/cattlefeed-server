const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Validation middleware
const registerValidation = [
  check("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Routes
router.post("/register", registerValidation, authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", auth, authController.logout);

module.exports = router;
