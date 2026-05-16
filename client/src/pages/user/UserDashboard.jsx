import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getUserComplaints,
} from "../../services/complaintService";

const UserDashboard = () => {
  const [complaints, setComplaints] =
    useState([]);

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const data =
        await getUserComplaints();

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

  return (
    <DashboardLayout>
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        User Dashboard
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Complaints */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-gray-500">
            Total Complaints
          </h2>

          <p className="text-4xl font-bold mt-3 text-indigo-600">
            {complaints.length}
          </p>
        </div>

        {/* Pending Complaints */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-gray-500">
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

        {/* Resolved Complaints */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-gray-500">
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
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-10 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6">
          Recent Complaints
        </h2>

        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">
                Title
              </th>

              <th className="text-left py-3">
                Category
              </th>

              <th className="text-left py-3">
                Status
              </th>

              <th className="text-left py-3">
                Priority
              </th>
            </tr>
          </thead>

          <tbody>
            {complaints
              .slice(0, 5)
              .map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-4">
                    {item.title}
                  </td>

                  <td className="py-4">
                    {item.category}
                  </td>

                  <td className="py-4">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      {item.status}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Empty State */}
        {complaints.length ===
          0 && (
          <div className="text-center py-10 text-gray-500">
            No complaints yet
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;