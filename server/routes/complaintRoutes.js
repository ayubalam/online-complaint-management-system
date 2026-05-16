const express = require("express");

const router = express.Router();

const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  sendMessage,
  deleteComplaint,
  hideComplaintHistory,
  updateComplaintStatus,
  assignWorker,
  getWorkerComplaints,
} = require(
  "../controllers/complaintController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const upload = require(
  "../config/multer"
);

const {
  adminOnly,
} = require(
  "../middleware/adminMiddleware"
);

const {
  workerOnly,
} = require(
  "../middleware/workerMiddleware"
);


// USER ROUTES

// Create Complaint
// Multiple Images Upload
router.post(
  "/",
  protect,
  upload.array(
    "images",
    5
  ),
  createComplaint
);

// Get User Complaints
router.get(
  "/my",
  protect,
  getUserComplaints
);

// Delete Pending Complaint
router.delete(
  "/:id",
  protect,
  deleteComplaint
);

// Hide Complaint History
router.put(
  "/:id/hide",
  protect,
  hideComplaintHistory
);


// REALTIME CHAT ROUTE

router.post(
  "/:id/message",
  protect,
  sendMessage
);


// ADMIN ROUTES

// Get All Complaints
router.get(
  "/all",
  protect,
  adminOnly,
  getAllComplaints
);


// STATUS UPDATE

router.put(
  "/:id/status",
  protect,
  updateComplaintStatus
);


// ASSIGN WORKER

router.put(
  "/:id/assign",
  protect,
  adminOnly,
  assignWorker
);


// WORKER ROUTES

router.get(
  "/worker",
  protect,
  workerOnly,
  getWorkerComplaints
);


module.exports = router;