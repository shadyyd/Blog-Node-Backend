const express = require("express");
const { signupSchema, loginSchema } = require("../validation/userSchemas");
const validate = require("../middlewares/validate");
const { signup, login, getProfile } = require("../controller/usersController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);

router.get("/profile", auth, getProfile);

module.exports = router;
