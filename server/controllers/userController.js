const User = require("../models/User");

const bcrypt = require("bcryptjs");


// Get Profile
const getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update Profile
const updateProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    user.name =
      req.body.name || user.name;

    user.email =
      req.body.email || user.email;

    // Image
    if (req.file) {
      user.profileImage =
        req.file.filename;
    }

    // Password
    if (req.body.password) {
      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(
          req.body.password,
          salt
        );
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage:
        user.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getProfile,
  updateProfile,
};