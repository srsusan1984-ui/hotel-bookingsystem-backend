const express = require("express");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

// GET USER PROFILE
router.get(
  "/profile/:id",
  getUserProfile
);

// UPDATE USER PROFILE
router.put(
  "/profile/:id",
  updateUserProfile
);

module.exports = router;