const Complaint = require("../models/Complaint");

const User = require("../models/User");

const nodemailer = require("nodemailer");


// Email Transporter
const transporter =
  nodemailer.createTransport({
    service: "gmail",

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    family: 4,

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });


// Send Email Function
const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    console.log("TO:", to);
    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to,

      subject,

      html,
    });

    console.log(
      "REAL EMAIL SENT"
    );
  } catch (error) {
    console.log(
      "Email Error:",
      error
    );
  }
};


// Create Complaint
const createComplaint = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      category,
      location,
      priority,
    } = req.body;

    const complaint =
      await Complaint.create({
        user: req.user._id,

        title,
        description,
        category,
        location,
        priority,

        // Multiple Images
        images: req.files
          ? req.files.map(
              (file) =>
                file.filename
            )
          : [],

        timeline: [
          {
            message:
              "Complaint created",
          },
        ],
      });

    const user =
      await User.findById(
        req.user._id
      );

    // User Notification
    user.notifications.push({
      message: `Complaint "${title}" created successfully`,
    });

    await user.save();

    // Admin Notifications
    const admins =
      await User.find({
        role: "admin",
      });

    for (const admin of admins) {
      admin.notifications.push({
        message: `New complaint created: "${title}"`,
      });

      await admin.save();
    }

    // Background Email
    sendEmail(
      user.email,
      "Complaint Registered",
      `
      <h2>Complaint Registered Successfully</h2>

      <p>Your complaint has been submitted.</p>

      <p><strong>Title:</strong> ${title}</p>

      <p><strong>Status:</strong> Pending</p>
      `
    );

    res.status(201).json(
      complaint
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// User Complaints
const getUserComplaints = async (
  req,
  res
) => {
  try {
    const complaints =
      await Complaint.find({
        user: req.user._id,

        hiddenFromUser: false,
      })
        .populate(
          "messages.sender",
          "name role"
        )
        .sort({
          createdAt: -1,
        });

    res.json(complaints);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Admin Complaints
const getAllComplaints = async (
  req,
  res
) => {
  try {
    const complaints =
      await Complaint.find()
        .populate(
          "user",
          "name email"
        )
        .populate(
          "assignedWorker",
          "name email"
        )
        .populate(
          "messages.sender",
          "name role"
        )
        .sort({
          createdAt: -1,
        });

    res.json(complaints);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Send Chat Message
const sendMessage =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res.status(404).json({
          message:
            "Complaint not found",
        });
      }

      const message = {
        sender:
          req.user._id,

        senderRole:
          req.user.role,

        text: req.body.text,
      };

      complaint.messages.push(
        message
      );

      await complaint.save();

      // Notification Target
      let notificationUserId;

      if (
        req.user.role ===
        "worker"
      ) {
        notificationUserId =
          complaint.user;
      } else {
        notificationUserId =
          complaint.assignedWorker;
      }

      // User/Worker Notification
      if (notificationUserId) {
        const notifyUser =
          await User.findById(
            notificationUserId
          );

        if (notifyUser) {
          notifyUser.notifications.push({
            message: `New message on complaint "${complaint.title}"`,
          });

          await notifyUser.save();
        }
      }

      // Admin Notifications
      const admins =
        await User.find({
          role: "admin",
        });

      for (const admin of admins) {
        admin.notifications.push({
          message: `New message on complaint "${complaint.title}"`,
        });

        await admin.save();
      }

      const updatedComplaint =
        await Complaint.findById(
          req.params.id
        ).populate(
          "messages.sender",
          "name role"
        );

      // Realtime Chat Event
      global.io.emit(
        "newMessage",
        {
          complaintId:
            complaint._id,

          message:
            updatedComplaint
              .messages[
              updatedComplaint
                .messages
                .length - 1
            ],
        }
      );

      res.json(
        updatedComplaint.messages
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };


// Delete Complaint
const deleteComplaint =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res.status(404).json({
          message:
            "Complaint not found",
        });
      }

      if (
        complaint.user.toString() !==
        req.user._id.toString()
      ) {
        return res.status(401).json({
          message:
            "Unauthorized",
        });
      }

      if (
        complaint.status !==
        "Pending"
      ) {
        return res.status(400).json({
          message:
            "Only pending complaints can be deleted",
        });
      }

      await complaint.deleteOne();

      res.json({
        message:
          "Complaint deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };


// Hide Complaint History
const hideComplaintHistory =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res.status(404).json({
          message:
            "Complaint not found",
        });
      }

      if (
        complaint.user.toString() !==
        req.user._id.toString()
      ) {
        return res.status(401).json({
          message:
            "Unauthorized",
        });
      }

      complaint.hiddenFromUser =
        true;

      await complaint.save();

      res.json({
        message:
          "Complaint history removed",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };


// Update Complaint Status
const updateComplaintStatus =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        ).populate(
          "user",
          "name email"
        );

      if (!complaint) {
        return res.status(404).json({
          message:
            "Complaint not found",
        });
      }

      complaint.status =
        req.body.status ||
        complaint.status;

      complaint.remarks =
        req.body.remarks ||
        complaint.remarks;

      complaint.timeline.push({
        message: `Status changed to ${req.body.status}`,
      });

      await complaint.save();

      // User Notification
      const notifyUser =
        await User.findById(
          complaint.user._id
        );

      notifyUser.notifications.push({
        message: `Complaint "${complaint.title}" updated to "${complaint.status}"`,
      });

      await notifyUser.save();

      // Admin Notifications
      const admins =
        await User.find({
          role: "admin",
        });

      for (const admin of admins) {
        admin.notifications.push({
          message: `Complaint "${complaint.title}" updated to "${complaint.status}"`,
        });

        await admin.save();
      }

      // Background Email
      sendEmail(
        complaint.user.email,
        "Complaint Status Updated",
        `
        <h2>Complaint Status Updated</h2>

        <p><strong>Complaint:</strong> ${complaint.title}</p>

        <p><strong>New Status:</strong> ${complaint.status}</p>
        `
      );

      const complaintOwnerId =
        complaint.user._id.toString();

      const ownerSocketId =
        global.onlineUsers[
          complaintOwnerId
        ];

      if (ownerSocketId) {
        global.io
          .to(ownerSocketId)
          .emit(
            "statusUpdated",
            complaint
          );
      }

      res.json(complaint);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };


// Assign Worker
const assignWorker = async (
  req,
  res
) => {
  try {
    const complaint =
      await Complaint.findById(
        req.params.id
      ).populate(
        "user",
        "name email"
      );

    if (!complaint) {
      return res.status(404).json({
        message:
          "Complaint not found",
      });
    }

    const worker =
      await User.findById(
        req.body.workerId
      );

    complaint.assignedWorker =
      req.body.workerId;

    complaint.status =
      "Assigned";

    complaint.timeline.push({
      message:
        "Complaint assigned to worker",
    });

    await complaint.save();

    // Worker Notification
    worker.notifications.push({
      message: `New complaint assigned: "${complaint.title}"`,
    });

    await worker.save();

    // User Notification
    const complaintUser =
      await User.findById(
        complaint.user._id
      );

    complaintUser.notifications.push({
      message: `Worker assigned to complaint "${complaint.title}"`,
    });

    await complaintUser.save();

    // Admin Notifications
    const admins =
      await User.find({
        role: "admin",
      });

    for (const admin of admins) {
      admin.notifications.push({
        message: `Worker assigned to complaint "${complaint.title}"`,
      });

      await admin.save();
    }

    // Background Emails
    sendEmail(
      worker.email,
      "New Complaint Assigned",
      `
      <h2>New Complaint Assigned</h2>

      <p><strong>Complaint:</strong> ${complaint.title}</p>

      <p>Please login to your dashboard.</p>
      `
    );

    sendEmail(
      complaint.user.email,
      "Worker Assigned",
      `
      <h2>Worker Assigned</h2>

      <p>A worker has been assigned to your complaint.</p>

      <p><strong>Complaint:</strong> ${complaint.title}</p>
      `
    );

    const workerSocketId =
      global.onlineUsers[
        req.body.workerId
      ];

    if (workerSocketId) {
      global.io
        .to(workerSocketId)
        .emit(
          "workerAssigned",
          complaint
        );
    }

    res.json(complaint);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Worker Complaints
const getWorkerComplaints =
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find({
          assignedWorker:
            req.user._id,
        })
          .populate(
            "user",
            "name email"
          )
          .populate(
            "messages.sender",
            "name role"
          )
          .sort({
            createdAt: -1,
          });

      res.json(complaints);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };


module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  sendMessage,
  deleteComplaint,
  hideComplaintHistory,
  updateComplaintStatus,
  assignWorker,
  getWorkerComplaints,
};