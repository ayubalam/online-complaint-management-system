import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getAllComplaints,
  updateComplaintStatus,
  assignWorker,
} from "../../services/complaintService";

import {
  getWorkers,
} from "../../services/userService";

import ComplaintTimeline from "../../components/common/ComplaintTimeline";

const AdminComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [workers, setWorkers] =
    useState([]);

  const [selectedComplaint,
    setSelectedComplaint] =
    useState(null);

  // Filters
  const [search, setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [priorityFilter,
    setPriorityFilter] =
    useState("All");

  const [sortOrder,
    setSortOrder] =
    useState("Newest");

  // Pagination
  const [currentPage,
    setCurrentPage] =
    useState(1);

  const complaintsPerPage = 5;

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const data =
        await getAllComplaints();

      setComplaints(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    }
  };

  // Fetch Workers
const fetchWorkers = async () => {
  try {
    const data =
      await getWorkers();

    // Backend already returns only workers
    setWorkers(data);

    console.log(
      "Workers:",
      data
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to load workers"
    );
  }
};

  useEffect(() => {
    const loadData = async () => {
      await fetchComplaints();

      await fetchWorkers();
    };

    loadData();
  }, []);

  // Export PDF
  const exportPDF = () => {
    const doc =
      new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "Complaint Report",
      14,
      20
    );

    const tableColumn = [
      "User",
      "Title",
      "Category",
      "Priority",
      "Status",
    ];

    const tableRows = [];

    filteredComplaints.forEach(
      (complaint) => {
        const complaintData = [
          complaint.user?.name,
          complaint.title,
          complaint.category,
          complaint.priority,
          complaint.status,
        ];

        tableRows.push(
          complaintData
        );
      }
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(
      "complaints-report.pdf"
    );
  };

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
            "Failed to update status"
        );
      }
    };

  // Assign Worker
  const handleAssignWorker =
    async (id, workerId) => {
      try {
        await assignWorker(
          id,
          workerId
        );

        toast.success(
          "Worker assigned"
        );

        fetchComplaints();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Assignment failed"
        );
      }
    };

  // Filtered Complaints
  const filteredComplaints =
    complaints
      .filter((complaint) => {
        const matchesSearch =
          complaint.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =
          statusFilter === "All"
            ? true
            : complaint.status ===
              statusFilter;

        const matchesPriority =
          priorityFilter === "All"
            ? true
            : complaint.priority ===
              priorityFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );
      })
      .sort((a, b) => {
        if (
          sortOrder === "Newest"
        ) {
          return (
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
          );
        }

        return (
          new Date(
            a.createdAt
          ) -
          new Date(
            b.createdAt
          )
        );
      });

  // Pagination
  const indexOfLastComplaint =
    currentPage *
    complaintsPerPage;

  const indexOfFirstComplaint =
    indexOfLastComplaint -
    complaintsPerPage;

  const currentComplaints =
    filteredComplaints.slice(
      indexOfFirstComplaint,
      indexOfLastComplaint
    );

  const totalPages =
    Math.ceil(
      filteredComplaints.length /
        complaintsPerPage
    );

  return (
    <DashboardLayout>
      {/* Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Manage Complaints
          </h1>

          <p className="text-gray-500 mt-1">
            Search, filter and manage complaints
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={exportPDF}
          className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition mt-4 md:mt-0"
        >
          Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border rounded-xl p-3"
          />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border rounded-xl p-3"
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

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
            className="border rounded-xl p-3"
          >
            <option value="All">
              All Priority
            </option>

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>
          </select>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                e.target.value
              )
            }
            className="border rounded-xl p-3"
          >
            <option>
              Newest
            </option>

            <option>
              Oldest
            </option>
          </select>
        </div>
      </div>

      {/* Complaint Cards */}
      <div className="space-y-6">
        {currentComplaints.map(
          (complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-2xl shadow-md p-5"
            >
              {/* Header */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
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

                {/* Category */}
                <div>
                  <p className="text-sm text-gray-500">
                    Category
                  </p>

                  <h2 className="font-medium">
                    {
                      complaint.category
                    }
                  </h2>
                </div>

                {/* Priority */}
                <div>
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {
                      complaint.priority
                    }
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    {
                      complaint.status
                    }
                  </span>
                </div>

                {/* Button */}
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

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          disabled={
            currentPage === 1
          }
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
          className="bg-gray-200 px-4 py-2 rounded-xl disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {[
            ...Array(
              totalPages
            ),
          ].map((_, index) => (
            <button
              key={index}
              onClick={() =>
                setCurrentPage(
                  index + 1
                )
              }
              className={`w-10 h-10 rounded-xl ${
                currentPage ===
                index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          disabled={
            currentPage ===
            totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
          className="bg-gray-200 px-4 py-2 rounded-xl disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[95vh]">
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
{/* Main */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

  {/* Left */}
  <div>
    {selectedComplaint.images &&
    selectedComplaint.images.length >
      0 ? (
      <img
        src={`http://localhost:5000/uploads/${selectedComplaint.images[0]}`}
        alt="Complaint"
        className="w-full h-72 object-cover rounded-2xl border"
      />
    ) : (
      <div className="w-full h-72 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        No Image
      </div>
    )}

    {/* Description */}
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-3">
        Description
      </h2>

      <p className="text-gray-600 leading-7">
        {
          selectedComplaint.description
        }
      </p>
    </div>
  </div>

  {/* Right */}
  <div className="space-y-6">

    {/* Info */}
    <div className="bg-gray-50 rounded-2xl p-5">
      <h2 className="text-2xl font-bold mb-5">
        Complaint Info
      </h2>

      <div className="space-y-3">
        <p>
          <span className="font-semibold">
            User:
          </span>{" "}
          {
            selectedComplaint.user
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

    {/* Controls */}
    <div className="bg-gray-50 rounded-2xl p-5">
      <h2 className="text-2xl font-bold mb-5">
        Manage Complaint
      </h2>

      {/* Assign */}
      <div className="mb-5">
        <label className="block mb-2 font-medium">
          Assign Worker
        </label>

        <select
          className="border p-3 rounded-xl w-full"
          onChange={(e) =>
            handleAssignWorker(
              selectedComplaint._id,
              e.target.value
            )
          }
        >
          <option value="">
            Select Worker
          </option>

          {workers.map(
            (worker) => (
              <option
                key={
                  worker._id
                }
                value={
                  worker._id
                }
              >
                {
                  worker.name
                }
              </option>
            )
          )}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block mb-2 font-medium">
          Update Status
        </label>

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
            Pending
          </option>

          <option>
            Assigned
          </option>

          <option>
            In Progress
          </option>

          <option>
            Resolved
          </option>

          <option>
            Rejected
          </option>
        </select>
      </div>
    </div>
  </div>
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
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminComplaints;