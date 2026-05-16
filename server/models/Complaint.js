const mongoose = require("mongoose");

const complaintSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      assignedWorker: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null,
      },

      title: {
        type: String,

        required: true,

        trim: true,
      },

      description: {
        type: String,

        required: true,
      },

      category: {
        type: String,

        required: true,
      },

      location: {
        type: String,

        default: "",
      },

      images: [
        {
         type: String,
         },
         ],
      status: {
        type: String,

        enum: [
          "Pending",
          "Assigned",
          "In Progress",
          "Resolved",
          "Rejected",
        ],

        default: "Pending",
      },

      priority: {
        type: String,

        enum: [
          "Low",
          "Medium",
          "High",
        ],

        default: "Medium",
      },

      remarks: {
        type: String,

        default: "",
      },

      // Hide From User
      hiddenFromUser: {
        type: Boolean,

        default: false,
      },

      // Timeline Tracking
      timeline: [
        {
          message: {
            type: String,
          },

          createdAt: {
            type: Date,

            default: Date.now,
          },
        },
      ],

      // Realtime Chat Messages
      messages: [
        {
          sender: {
            type:
              mongoose.Schema.Types.ObjectId,

            ref: "User",
          },

          senderRole: {
            type: String,

            enum: [
              "user",
              "worker",
              "admin",
            ],
          },

          text: {
            type: String,

            required: true,
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
    "Complaint",
    complaintSchema
  );