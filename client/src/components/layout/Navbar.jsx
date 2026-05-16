import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaMoon,
  FaSun,
  FaTimes,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../hooks/useAuth";

import NotificationBell from "../common/NotificationBell";

const Navbar = () => {
  const { user, logout } =
    useAuth();

  const navigate =
    useNavigate();

  // Mobile Menu
  const [mobileMenu,
    setMobileMenu] =
    useState(false);

  // Theme
  const [darkMode,
    setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "theme"
        ) === "dark"
      );
    });

  // Apply Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  // Logout
  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  // Close Mobile Menu
  const closeMenu = () => {
    setMobileMenu(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-950 shadow-md sticky top-0 z-50 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600"
          >
            ComplaintMS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">

            {user && (
              <>
                {/* Dashboard */}
                <Link
                  to={`/${user.role}/dashboard`}
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>

                {/* USER LINKS */}
                {user.role ===
                  "user" && (
                  <>
                    <Link
                      to="/user/create-complaint"
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                    >
                      Create Complaint
                    </Link>

                    <Link
                      to="/user/my-complaints"
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                    >
                      My Complaints
                    </Link>
                  </>
                )}

                {/* ADMIN LINKS */}
                {user.role ===
                  "admin" && (
                  <>
                    <Link
                      to="/admin/complaints"
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                    >
                      Manage Complaints
                    </Link>

                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                    >
                      Analytics
                    </Link>
                  </>
                )}

                {/* WORKER LINKS */}
                {user.role ===
                  "worker" && (
                  <Link
                    to="/worker/complaints"
                    className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                  >
                    Assigned Tasks
                  </Link>
                )}

                {/* Notifications */}
                <NotificationBell />

                {/* Theme Toggle */}
                <button
                  onClick={() =>
                    setDarkMode(
                      !darkMode
                    )
                  }
                  className="text-xl text-gray-700 dark:text-yellow-400 hover:scale-110 transition"
                >
                  {darkMode ? (
                    <FaSun />
                  ) : (
                    <FaMoon />
                  )}
                </button>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                >
                  Profile
                </Link>

                {/* Logout */}
                <button
                  onClick={
                    handleLogout
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

            {/* Guest */}
            {!user && (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={() =>
                    setDarkMode(
                      !darkMode
                    )
                  }
                  className="text-xl text-gray-700 dark:text-yellow-400 hover:scale-110 transition"
                >
                  {darkMode ? (
                    <FaSun />
                  ) : (
                    <FaMoon />
                  )}
                </button>

                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-4 lg:hidden">

            {/* Notification */}
            {user && (
              <NotificationBell />
            )}

            {/* Theme */}
            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              className="text-xl text-gray-700 dark:text-yellow-400"
            >
              {darkMode ? (
                <FaSun />
              ) : (
                <FaMoon />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setMobileMenu(
                  !mobileMenu
                )
              }
              className="text-2xl text-gray-700 dark:text-white"
            >
              {mobileMenu ? (
                <FaTimes />
              ) : (
                <FaBars />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenu && (
          <div className="lg:hidden py-4 border-t flex flex-col gap-4 bg-white dark:bg-gray-950">

            {user && (
              <>
                {/* Dashboard */}
                <Link
                  to={`/${user.role}/dashboard`}
                  onClick={
                    closeMenu
                  }
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>

                {/* USER */}
                {user.role ===
                  "user" && (
                  <>
                    <Link
                      to="/user/create-complaint"
                      onClick={
                        closeMenu
                      }
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                    >
                      Create Complaint
                    </Link>

                    <Link
                      to="/user/my-complaints"
                      onClick={
                        closeMenu
                      }
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                    >
                      My Complaints
                    </Link>
                  </>
                )}

                {/* ADMIN */}
                {user.role ===
                  "admin" && (
                  <>
                    <Link
                      to="/admin/complaints"
                      onClick={
                        closeMenu
                      }
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                    >
                      Manage Complaints
                    </Link>

                    <Link
                      to="/admin/dashboard"
                      onClick={
                        closeMenu
                      }
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                    >
                      Analytics
                    </Link>
                  </>
                )}

                {/* WORKER */}
                {user.role ===
                  "worker" && (
                  <Link
                    to="/worker/complaints"
                    onClick={
                      closeMenu
                    }
                    className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                  >
                    Assigned Tasks
                  </Link>
                )}

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={
                    closeMenu
                  }
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                >
                  Profile
                </Link>

                {/* Logout */}
                <button
                  onClick={
                    handleLogout
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full"
                >
                  Logout
                </button>
              </>
            )}

            {/* Guest */}
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={
                    closeMenu
                  }
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={
                    closeMenu
                  }
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;