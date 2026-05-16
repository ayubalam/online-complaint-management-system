import {
  useEffect,
  useState,
  useRef,
} from "react";

import toast from "react-hot-toast";

import socket from "../../services/socket";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getWorkerComplaints,
  updateComplaintStatus,
  sendComplaintMessage,
} from "../../services/complaintService";

import ComplaintTimeline from "../../components/common/ComplaintTimeline";

const WorkerComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

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

  // Notification Sound
  const notificationSound =
    new Audio(
      "https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3"
    );

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const data =
        await getWorkerComplaints();

      setComplaints(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load tasks"
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
          notificationSound.play();

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

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [
    selectedComplaint?.messages,
  ]);

  // Update Status
  const handleStatusChange =
    async (id, status) => {
      try {
        await updateComplaintStatus(
          id,
          { status }
        );

        toast.success(
          "Status updated"
        );

        fetchComplaints();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Update failed"
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
          role: "worker",
        }
      );
    } else {
      socket.emit(
        "stopTyping"
      );
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Assigned Complaints
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and resolve assigned complaints
        </p>
      </div>

      {/* Empty State */}
      {complaints.length ===
        0 && (
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-500">
          No assigned complaints
        </div>
      )}

      {/* Complaint Cards */}
      <div className="space-y-8">
        {complaints.map(
          (complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-2xl shadow-lg p-6"
            >

              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">

                {/* User */}
                <div>
                  <p className="text-sm text-gray-500">
                    User
                  </p>

                  <h2 className="font-bold">
                    {
                      complaint.user
                        ?.name
                    }
                  </h2>
                </div>

                {/* Title */}
                <div>
                  <p className="text-sm text-gray-500">
                    Complaint
                  </p>

                  <h2 className="font-bold">
                    {
                      complaint.title
                    }
                  </h2>
                </div>

                {/* Images */}
                <div className="flex gap-2 flex-wrap">

                  {complaint.images &&
                  complaint.images
                    .length > 0 ? (
                    complaint.images
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
                            className="w-16 h-16 object-cover rounded-xl border cursor-pointer hover:scale-105 transition"
                          />
                        )
                      )
                  ) : (
                    <div className="text-gray-400 text-sm">
                      No Images
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Priority
                  </p>

                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {
                      complaint.priority
                    }
                  </span>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Status
                  </p>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    {
                      complaint.status
                    }
                  </span>
                </div>

                {/* View Button */}
                <div>
                  <button
                    onClick={() =>
                      setSelectedComplaint(
                        complaint
                      )
                    }
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )
        )}
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

                {/* Complaint Info */}
                <div className="bg-gray-50 rounded-2xl p-6">

                  <h2 className="text-2xl font-bold mb-6">
                    Complaint Info
                  </h2>

                  <div className="space-y-4">

                    <p>
                      <span className="font-semibold">
                        User:
                      </span>{" "}
                      {
                        selectedComplaint
                          .user
                          ?.name
                      }
                    </p>

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
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gray-50 rounded-2xl p-6">

                  <h2 className="text-2xl font-bold mb-6">
                    Update Status
                  </h2>

                  <select
                    className="border p-3 rounded-xl w-full"
                    value={
                      selectedComplaint.status
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        selectedComplaint._id,
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Assigned
                    </option>

                    <option>
                      In Progress
                    </option>

                    <option>
                      Resolved
                    </option>
                  </select>
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
                              "worker"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                                msg.senderRole ===
                                "worker"
                                  ? "bg-green-100 text-green-900"
                                  : "bg-indigo-100 text-indigo-900"
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
                        "worker" && (
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

          {/* Close */}
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

export default WorkerComplaints;