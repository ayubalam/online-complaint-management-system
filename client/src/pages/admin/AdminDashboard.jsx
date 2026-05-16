import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getAllComplaints,
} from "../../services/complaintService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#F59E0B",
  "#10B981",
  "#EF4444",
];

const AdminDashboard = () => {
  const [complaints, setComplaints] =
    useState([]);

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const data =
        await getAllComplaints();

      setComplaints(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadComplaints =
      async () => {
        await fetchComplaints();
      };

    loadComplaints();
  }, []);

  // Status Data
  const statusData = [
    {
      name: "Pending",
      value:
        complaints.filter(
          (c) =>
            c.status ===
            "Pending"
        ).length,
    },

    {
      name: "Assigned",
      value:
        complaints.filter(
          (c) =>
            c.status ===
            "Assigned"
        ).length,
    },

    {
      name: "Resolved",
      value:
        complaints.filter(
          (c) =>
            c.status ===
            "Resolved"
        ).length,
    },

    {
      name: "Rejected",
      value:
        complaints.filter(
          (c) =>
            c.status ===
            "Rejected"
        ).length,
    },
  ];

  // Priority Data
  const priorityData = [
    {
      name: "Low",
      value:
        complaints.filter(
          (c) =>
            c.priority ===
            "Low"
        ).length,
    },

    {
      name: "Medium",
      value:
        complaints.filter(
          (c) =>
            c.priority ===
            "Medium"
        ).length,
    },

    {
      name: "High",
      value:
        complaints.filter(
          (c) =>
            c.priority ===
            "High"
        ).length,
    },
  ];

  // Monthly Trends
  const monthlyData = [
    {
      month: "Jan",
      complaints: 4,
    },

    {
      month: "Feb",
      complaints: 6,
    },

    {
      month: "Mar",
      complaints: 8,
    },

    {
      month: "Apr",
      complaints: 5,
    },

    {
      month: "May",
      complaints:
        complaints.length,
    },
  ];

  return (
    <DashboardLayout>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1 text-sm">
          Analytics and complaint insights
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-gray-500 text-sm">
            Total Complaints
          </h2>

          <p className="text-4xl font-bold mt-3 text-indigo-600">
            {complaints.length}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-gray-500 text-sm">
            Pending
          </h2>

          <p className="text-4xl font-bold mt-3 text-yellow-500">
            {
              complaints.filter(
                (c) =>
                  c.status ===
                  "Pending"
              ).length
            }
          </p>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-gray-500 text-sm">
            Resolved
          </h2>

          <p className="text-4xl font-bold mt-3 text-green-600">
            {
              complaints.filter(
                (c) =>
                  c.status ===
                  "Resolved"
              ).length
            }
          </p>
        </div>

        {/* High */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-gray-500 text-sm">
            High Priority
          </h2>

          <p className="text-4xl font-bold mt-3 text-red-500">
            {
              complaints.filter(
                (c) =>
                  c.priority ===
                  "High"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Pie */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">
            Complaint Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {statusData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">
            Complaint Priority
          </h2>

          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <BarChart
              data={priorityData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                fill="#4F46E5"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">
          Monthly Complaint Trends
        </h2>

        <ResponsiveContainer
          width="100%"
          height={260}
        >
          <LineChart
            data={monthlyData}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="complaints"
              stroke="#4F46E5"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;