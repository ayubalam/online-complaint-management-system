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

  // Unread Count
  const unreadCount =
    notifications.filter(
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
        <div className="absolute right-0 mt-4 w-96 bg-white shadow-2xl rounded-3xl overflow-hidden z-50 border">

          {/* Header */}
          <div className="bg-indigo-600 text-white px-5 py-4 flex items-center justify-between">

            <h2 className="text-xl font-bold">
              Notifications
            </h2>

            {notifications.length >
              0 && (
              <button
                onClick={
                  markAllRead
                }
                className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[500px] overflow-y-auto p-4 bg-gray-50">

            {notifications.length ===
            0 ? (
              <div className="text-center py-10 text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl mb-4 shadow-sm border transition ${
                      item.read ===
                      true
                        ? "bg-gray-100 opacity-70"
                        : "bg-indigo-50 border-indigo-300"
                    }`}
                  >

                    {/* Message */}
                    <p className="text-sm text-gray-800 leading-6">
                      {
                        item.message
                      }
                    </p>

                    {/* Time */}
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </p>

                    {/* Unread Dot */}
                    {item.read ===
                      false && (
                      <div className="mt-2 flex items-center gap-2">

                        <span className="w-2 h-2 bg-indigo-600 rounded-full" />

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