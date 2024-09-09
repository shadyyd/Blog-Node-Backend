const User = require("./../model/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const AppError = require("../utils/AppError");

const jwtVerify = util.promisify(jwt.verify);

module.exports = async (req, res, next) => {
  let { authorization: token } = req.headers;
  token = token.split(" ")[1];
  const payload = await jwtVerify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.userId).select(
    "-createdAt -updatedAt -__v"
  );
  if (!user) throw new AppError("User not logged in", 403);
  req.user = user;
  next();
};
