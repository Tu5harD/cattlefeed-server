const User = require("../module/user.js");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const { username, email, password, mobileNumber, address } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    mobileNumber,
    address,
  });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, "Tushar@0945");
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

exports.signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};
