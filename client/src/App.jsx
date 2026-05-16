import {
  Routes,
  Route,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import HomePage from "./pages/HomePage";

import Login from "./pages/auth/Login";

import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";

import UserDashboard from "./pages/user/UserDashboard";

import WorkerDashboard from "./pages/worker/WorkerDashboard";

import CreateComplaint from "./pages/user/CreateComplaint";

import MyComplaints from "./pages/user/MyComplaints";

import AdminComplaints from "./pages/admin/AdminComplaints";

import WorkerComplaints from "./pages/worker/WorkerComplaints";

import ProfilePage from "./pages/profile/ProfilePage";

import ProtectedRoute from "./routes/ProtectedRoute";

import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Toast */}
      <Toaster position="top-right" />

      {/* Routes */}
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin Complaints */}
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminComplaints />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <UserDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Create Complaint */}
        <Route
          path="/user/create-complaint"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <CreateComplaint />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* My Complaints */}
        <Route
          path="/user/my-complaints"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <MyComplaints />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Worker Dashboard */}
        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="worker">
                <WorkerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Worker Complaints */}
        <Route
          path="/worker/complaints"
          element={
            <ProtectedRoute>
              <RoleRoute role="worker">
                <WorkerComplaints />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;