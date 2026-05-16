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

const MyComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [selectedComplaint,
    setSelectedComplaint] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [typingUser,
    setTypingUser] =
    useState("");

  const [previewImage,
    setPreviewImage] =
    useState("");

  // Auto Scroll Ref
  const messagesEndRef =
    useRef(null);

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const data =
        await getUserComplaints();

      setComplaints(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
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
                              src={`http://localhost:5000/uploads/${image}`}
                              alt="Complaint"
                              onClick={() =>
                                setPreviewImage(
                                  `http://localhost:5000/uploads/${image}`
                                )
                              }
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

      {/* Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[95vh]">

            {/* Top */}
            <div className="flex items-center justify-between mb-8">

              <h1 className="text-3xl font-bold">
                Complaint Details
              </h1>

              <button
                onClick={() =>
                  setSelectedComplaint(
                    null
                  )
                }
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Left */}
              <div>

                {/* Images Gallery */}
                {selectedComplaint.images &&
                selectedComplaint.images
                  .length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">

                    {selectedComplaint.images.map(
                      (
                        image,
                        index
                      ) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/uploads/${image}`}
                          alt="Complaint"
                          onClick={() =>
                            setPreviewImage(
                              `http://localhost:5000/uploads/${image}`
                            )
                          }
                          className="w-full h-48 object-cover rounded-2xl border cursor-pointer hover:opacity-90 hover:scale-[1.02] transition"
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                    No Images
                  </div>
                )}

                {/* Description */}
                <div className="mt-8">

                  <h2 className="text-2xl font-bold mb-4">
                    Description
                  </h2>

                  <p className="text-gray-600 leading-7">
                    {
                      selectedComplaint.description
                    }
                  </p>
                </div>

                {/* Timeline */}
                {selectedComplaint.timeline &&
                  selectedComplaint.timeline
                    .length > 0 && (
                    <ComplaintTimeline
                      timeline={
                        selectedComplaint.timeline
                      }
                    />
                  )}
              </div>

              {/* Right */}
              <div className="space-y-8">

                {/* Info */}
                <div className="bg-gray-50 rounded-2xl p-6">

                  <h2 className="text-2xl font-bold mb-6">
                    Complaint Info
                  </h2>

                  <div className="space-y-4">

                    <p>
                      <span className="font-semibold">
                        Category:
                      </span>{" "}
                      {
                        selectedComplaint.category
                      }
                    </p>

                    <p>
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {
                        selectedComplaint.location
                      }
                    </p>

                    <p>
                      <span className="font-semibold">
                        Priority:
                      </span>{" "}
                      {
                        selectedComplaint.priority
                      }
                    </p>

                    <p>
                      <span className="font-semibold">
                        Status:
                      </span>{" "}
                      {
                        selectedComplaint.status
                      }
                    </p>

                    <p>
                      <span className="font-semibold">
                        Created:
                      </span>{" "}
                      {new Date(
                        selectedComplaint.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Chat Section */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm">

                  <h2 className="text-2xl font-bold mb-5">
                    Complaint Chat
                  </h2>

                  {/* Messages */}
                  <div className="h-80 overflow-y-auto space-y-4 border rounded-2xl p-4 bg-gray-50">

                    {selectedComplaint.messages &&
                    selectedComplaint.messages
                      .length > 0 ? (
                      selectedComplaint.messages.map(
                        (
                          msg,
                          index
                        ) => (
                          <div
                            key={index}
                            className={`flex ${
                              msg.senderRole ===
                              "user"
                                ? "justify-start"
                                : "justify-end"
                            }`}
                          >
                            <div
                              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                                msg.senderRole ===
                                "user"
                                  ? "bg-indigo-100 text-indigo-900"
                                  : "bg-green-100 text-green-900"
                              }`}
                            >
                              <p className="text-xs font-bold mb-1 capitalize">
                                {
                                  msg.senderRole
                                }
                              </p>

                              <p className="text-sm">
                                {msg.text}
                              </p>

                              <p className="text-[10px] mt-2 opacity-70">
                                {new Date(
                                  msg.createdAt
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-center text-gray-400 py-10">
                        No messages yet
                      </div>
                    )}

                    {/* Typing */}
                    {typingUser &&
                      typingUser !==
                        "user" && (
                        <div className="text-sm text-gray-500 italic">
                          {
                            typingUser
                          }{" "}
                          is typing...
                        </div>
                      )}

                    {/* Auto Scroll */}
                    <div
                      ref={
                        messagesEndRef
                      }
                    />
                  </div>

                  {/* Input */}
                  <div className="flex gap-3 mt-4">

                    <input
                      type="text"
                      placeholder="Type message..."
                      value={message}
                      onChange={
                        handleTyping
                      }
                      className="flex-1 border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                    />

                    <button
                      onClick={
                        handleSendMessage
                      }
                      className="bg-indigo-600 text-white px-6 rounded-2xl hover:bg-indigo-700 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">

          {/* Close Button */}
          <button
            onClick={() =>
              setPreviewImage("")
            }
            className="absolute top-5 right-5 text-white text-5xl hover:text-red-400 transition"
          >
            ✕
          </button>

          {/* Image */}
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