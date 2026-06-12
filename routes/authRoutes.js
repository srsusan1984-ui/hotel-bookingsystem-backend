const express = require("express");

const {
  userSignup,
  userLogin,
  agentSignup,
  agentLogin,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/user/signup",
  userSignup
);

router.post(
  "/user/login",
  userLogin
);

router.post(
  "/agent/signup",
  agentSignup
);

router.post(
  "/agent/login",
  agentLogin
);

module.exports = router;