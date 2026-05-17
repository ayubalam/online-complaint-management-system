import {
  useState,
} from "react";

import {
  FaBell,
} from "react-icons/fa";

import useNotifications from "../../hooks/useNotifications";

const NotificationBell = () => {
  const [open, setOpen] =
    useState(false);

  const {
    notifications,
    markAllRead,
  } = useNotifications();

  // Safe Notifications
  const safeNotifications =
    Array.isArray(
      notifications
    )
      ? notifications
      : [];

  // Unread Count
  const unreadCount =
    safeNotifications.filter(
      (n) => n.read === false
    ).length;

  // Toggle Dropdown
  const toggleDropdown =
    () => {
      setOpen(!open);
    };

  return (
    <div className="relative">

      {/* Bell */}
      <button
        onClick={toggleDropdown}
        className="relative text-2xl text-gray-700 hover:text-indigo-600 transition"
      >
        <FaBell />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 sm:absolute sm:right-0 sm:left-auto sm:translate-x-0 mt-2 w-[92vw] sm:w-96 max-w-[380px] bg-white shadow-2xl rounded-3xl overflow-hidden z-50 border">

          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-4 flex items-center justify-between gap-2">

            <h2 className="text-lg sm:text-xl font-bold">
              Notifications
            </h2>

            {safeNotifications.length >
              0 && (
              <button
                onClick={
                  markAllRead
                }
                className="text-xs sm:text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition whitespace-nowrap"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[70vh] overflow-y-auto p-3 sm:p-4 bg-gray-50">

            {safeNotifications.length ===
            0 ? (
              <div className="text-center py-10 text-gray-500">
                No notifications
              </div>
            ) : (
              safeNotifications.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    className={`w-full p-4 rounded-2xl mb-4 shadow-sm border transition overflow-hidden ${
                      item.read ===
                      true
                        ? "bg-gray-100 opacity-70"
                        : "bg-indigo-50 border-indigo-300"
                    }`}
                  >

                    {/* Message */}
                    <p className="text-sm text-gray-800 leading-6 break-words whitespace-normal overflow-hidden">
                      {
                        item.message
                      }
                    </p>

                    {/* Time */}
                    <p className="text-xs text-gray-400 mt-3 break-words">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </p>

                    {/* Unread Dot */}
                    {item.read ===
                      false && (
                      <div className="mt-2 flex items-center gap-2">

                        <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0" />

                        <span className="text-xs text-indigo-600 font-medium">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;