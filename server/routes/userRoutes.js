const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");


// Workers
const User = require("../models/User");


// Get Workers
router.get(
  "/workers",
  protect,
  async (req, res) => {
    try {
      const workers =
        await User.find({
          role: "worker",
        }).select(
          "name email"
        );

      res.json(workers);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);


// Get Notifications
router.get(
  "/notifications",
  protect,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        ).select(
          "notifications"
        );

      res.json(
        user.notifications.reverse()
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);


// Mark Notifications Read
router.put(
  "/notifications/read",
  protect,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      // Update all notifications
      user.notifications.forEach(
        (notification) => {
          notification.read = true;
        }
      );

      // VERY IMPORTANT
      user.markModified(
        "notifications"
      );

      await user.save();

      res.json({
        message:
          "Notifications marked as read",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// Profile
router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  upload.single(
    "profileImage"
  ),
  updateProfile
);

module.exports = router;