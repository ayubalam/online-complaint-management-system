const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      // Name
      name: {
        type: String,
        required: true,
        trim: true,
      },

      // Email
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },

      // Password
      password: {
        type: String,
        required: true,
      },

      // Role
      role: {
        type: String,
        enum: [
          "user",
          "admin",
          "worker",
        ],
        default: "user",
      },

      // Profile Image
      profileImage: {
        type: String,
        default: "",
      },

      // Notifications
      notifications: [
        {
          message: {
            type: String,
          },

          read: {
            type: Boolean,
            default: false,
          },

          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );