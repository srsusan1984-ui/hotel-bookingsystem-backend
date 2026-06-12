const User = require("../models/User");
const Agent = require("../models/Agent");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// USER SIGNUP

const userSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
      });

    res.status(201).json({
      message:
        "User Registered Successfully",
      user,
    });
  } catch (error) {
  console.log("LOGIN ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
};

// USER LOGIN

const userLogin = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message:
        "Login Successful",
      token,
      user,
    });
  } catch (error) {
  console.log("LOGIN ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
};

// AGENT SIGNUP

const agentSignup = async (req, res) => {
  try {
    const {
      hotelName,
      email,
      phone,
      password,
    } = req.body;

    const existingAgent =
      await Agent.findOne({
        email,
      });

    if (existingAgent) {
      return res.status(400).json({
        message:
          "Agent already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const agent =
      await Agent.create({
        hotelName,
        email,
        phone,
        password: hashedPassword,
      });

    res.status(201).json({
      message:
        "Agent Registered Successfully",
      agent,
    });
  } catch (error) {
  console.log("LOGIN ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
};

// AGENT LOGIN

const agentLogin = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const agent =
      await Agent.findOne({ email });

    if (!agent) {
      return res.status(404).json({
        message:
          "Agent not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        agent.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: agent._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message:
        "Agent Login Successful",
      token,
      agent,
    });
  }catch (error) {
  console.log("LOGIN ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
};

module.exports = {
  userSignup,
  userLogin,
  agentSignup,
  agentLogin,
};