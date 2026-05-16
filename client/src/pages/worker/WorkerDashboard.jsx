import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getWorkerComplaints,
} from "../../services/complaintService";

const WorkerDashboard = () => {
  const [complaints, setComplaints] =
    useState([]);

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const data =
        await getWorkerComplaints();

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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Worker Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and resolve assigned complaints
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-gray-500">
            Total Tasks
          </h2>

          <p className="text-5xl font-bold text-indigo-600 mt-4">
            {complaints.length}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-gray-500">
            Pending
          </h2>

          <p className="text-5xl font-bold text-yellow-500 mt-4">
            {
              complaints.filter(
                (c) =>
                  c.status ===
                  "Assigned"
              ).length
            }
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-gray-500">
            In Progress
          </h2>

          <p className="text-5xl font-bold text-blue-600 mt-4">
            {
              complaints.filter(
                (c) =>
                  c.status ===
                  "In Progress"
              ).length
            }
          </p>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-gray-500">
            Resolved
          </h2>

          <p className="text-5xl font-bold text-green-600 mt-4">
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
      <div className="bg-white rounded-3xl shadow-lg p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Recent Assigned Complaints
          </h2>
        </div>

        {complaints.length ===
        0 ? (
          <div className="text-center py-10 text-gray-500">
            No assigned complaints
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">
                  User
                </th>

                <th className="text-left py-4">
                  Complaint
                </th>

                <th className="text-left py-4">
                  Category
                </th>

                <th className="text-left py-4">
                  Priority
                </th>

                <th className="text-left py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {complaints
                .slice(0, 5)
                .map(
                  (
                    complaint
                  ) => (
                    <tr
                      key={
                        complaint._id
                      }
                      className="border-b hover:bg-gray-50 transition"
                    >
                      {/* User */}
                      <td className="py-4 font-medium">
                        {
                          complaint
                            .user
                            ?.name
                        }
                      </td>

                      {/* Title */}
                      <td className="py-4 font-semibold">
                        {
                          complaint.title
                        }
                      </td>

                      {/* Category */}
                      <td className="py-4">
                        {
                          complaint.category
                        }
                      </td>

                      {/* Priority */}
                      <td className="py-4">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                          {
                            complaint.priority
                          }
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                          {
                            complaint.status
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;