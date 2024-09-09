const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const util = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");
const logger = require("../utils/logger");

const jwtSign = util.promisify(jwt.sign);

exports.signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword, username });
  user.password = undefined;
  logger.info(`New user created: with id ${user._id}`);
  res.status(201).send({ message: "User created successfully", user });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select(
    "+password -createdAt -updatedAt -__v"
  );

  if (!user) {
    logger.warn(`Login attempt with invalid email: ${email}`);
    throw new AppError("Invalid email or password", 401);
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (isMatched) {
    const token = await jwtSign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    logger.info(`User logged in: ${user._id}`);
    user.password = undefined;
    res.status(200).json({ message: "User logged in", token, user });
  } else {
    logger.warn(`Login attempt with invalid password for email: ${email}`);
    throw new AppError("Invalid email or password", 401);
  }
};

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    throw new AppError("failed to fetch users", 404);
  }
  logger.info(`Fetched all users. Count: ${users.length}`);
  res.status(200).json({
    length: users.length,
    users,
  });
};

exports.getProfile = async (req, res, next) => {
  res.status(200).send({ user: req.user });
};
