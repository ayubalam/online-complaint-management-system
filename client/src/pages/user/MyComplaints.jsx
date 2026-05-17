import {
  useEffect,
  useState,
  useRef,
} from "react";

import toast from "react-hot-toast";

import {
  getUserComplaints,
  deleteComplaint,
  hideComplaintHistory,
  sendComplaintMessage,
} from "../../services/complaintService";

import socket from "../../services/socket";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getStatusColor,
} from "../../utils/statusColors";

import ComplaintTimeline from "../../components/common/ComplaintTimeline";

const BACKEND_URL =
  "https://complaintms-backend-7d29.onrender.com";

const MyComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    selectedComplaint,
    setSelectedComplaint,
  ] = useState(null);

  const [message, setMessage] =
    useState("");

  const [typingUser, setTypingUser] =
    useState("");

  const [previewImage, setPreviewImage] =
    useState("");

  // Auto Scroll Ref
  const messagesEndRef =
    useRef(null);

  // Fetch Complaints
  const fetchComplaints =
    async () => {
      try {
        const data =
          await getUserComplaints();

        setComplaints(data);
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to load complaints"
        );
      }
    };

  useEffect(() => {
    const loadComplaints =
      async () => {
        await fetchComplaints();
      };

    loadComplaints();
  }, []);

  // Realtime Socket Listener
  useEffect(() => {
    socket.on(
      "newMessage",
      (data) => {
        if (
          selectedComplaint &&
          data.complaintId ===
            selectedComplaint._id
        ) {
          setSelectedComplaint(
            (prev) => ({
              ...prev,

              messages: [
                ...prev.messages,
                data.message,
              ],
            })
          );
        }
      }
    );

    socket.on(
      "typing",
      (data) => {
        setTypingUser(
          data.role
        );
      }
    );

    socket.on(
      "stopTyping",
      () => {
        setTypingUser("");
      }
    );

    return () => {
      socket.off(
        "newMessage"
      );

      socket.off("typing");

      socket.off(
        "stopTyping"
      );
    };
  }, [selectedComplaint]);

  // Auto Scroll Messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [
    selectedComplaint?.messages,
  ]);

  // Delete Complaint
  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this complaint?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteComplaint(id);

        toast.success(
          "Complaint deleted successfully"
        );

        fetchComplaints();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  // Hide Complaint History
  const handleHideHistory =
    async (id) => {
      const confirmHide =
        window.confirm(
          "Remove this complaint from your history?"
        );

      if (!confirmHide)
        return;

      try {
        await hideComplaintHistory(
          id
        );

        toast.success(
          "Complaint removed from history"
        );

        fetchComplaints();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Action failed"
        );
      }
    };

  // Send Chat Message
  const handleSendMessage =
    async () => {
      if (!message.trim())
        return;

      try {
        const updatedMessages =
          await sendComplaintMessage(
            selectedComplaint._id,
            message
          );

        setSelectedComplaint({
          ...selectedComplaint,

          messages:
            updatedMessages,
        });

        setMessage("");

        socket.emit(
          "stopTyping"
        );

        toast.success(
          "Message sent"
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to send message"
        );
      }
    };

  // Handle Typing
  const handleTyping = (e) => {
    setMessage(
      e.target.value
    );

    if (
      e.target.value.trim()
    ) {
      socket.emit(
        "typing",
        {
          role: "user",
        }
      );
    } else {
      socket.emit(
        "stopTyping"
      );
    }
  };

  // Filter Logic
  const filteredComplaints =
    complaints.filter((item) => {
      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "All"
          ? true
          : item.status ===
            statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <DashboardLayout>
      <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">
          My Complaints
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border p-3 rounded-lg flex-1"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Assigned">
              Assigned
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Resolved">
              Resolved
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>
        </div>

        {/* Empty State */}
        {filteredComplaints.length ===
          0 && (
          <div className="text-center py-10 text-gray-500">
            No complaints found
          </div>
        )}

        {/* Complaint Cards */}
        <div className="space-y-8">
          {filteredComplaints.map(
            (item) => (
              <div
                key={item._id}
                className="border rounded-2xl p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
                  {/* Title */}
                  <div>
                    <h2 className="font-bold text-lg">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {
                        item.category
                      }
                    </p>
                  </div>

                  {/* Multiple Images */}
                  <div className="flex gap-2 flex-wrap">
                    {item.images &&
                    item.images.length >
                      0 ? (
                      item.images
                        .slice(0, 3)
                        .map(
                          (
                            image,
                            index
                          ) => (
                            <img
                              key={index}
                              src={`${BACKEND_URL}/uploads/${image}`}
                              alt="Complaint"
                              onClick={() =>
                                setPreviewImage(
                                  `${BACKEND_URL}/uploads/${image}`
                                )
                              }
                              onError={(
                                e
                              ) => {
                                e.target.src =
                                  "https://via.placeholder.com/150?text=No+Image";
                              }}
                              className="w-20 h-20 object-cover rounded-xl border cursor-pointer hover:scale-105 transition"
                            />
                          )
                        )
                    ) : (
                      <div className="text-gray-400 text-sm">
                        No Images
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`${getStatusColor(
                        item.status
                      )} px-4 py-2 rounded-full text-sm`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Priority */}
                  <div>
                    <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm">
                      {
                        item.priority
                      }
                    </span>
                  </div>

                  {/* Created */}
                  <div className="text-sm text-gray-500">
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </div>

                  {/* View */}
                  <div>
                    <button
                      onClick={() =>
                        setSelectedComplaint(
                          item
                        )
                      }
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Delete / Hide */}
                  <div>
                    {item.status ===
                    "Pending" ? (
                      <button
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleHideHistory(
                            item._id
                          )
                        }
                        className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-black transition"
                      >
                        Remove History
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* FULLSCREEN IMAGE PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <button
            onClick={() =>
              setPreviewImage("")
            }
            className="absolute top-5 right-5 text-white text-5xl hover:text-red-400 transition"
          >
            ✕
          </button>

          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyComplaints;