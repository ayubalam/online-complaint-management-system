import { useEffect, useState, useCallback } from "react";

import socket from "../services/socket";

import {
  getNotifications,
  markNotificationsRead,
} from "../services/userService";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Initial Fetch + Socket Events
  useEffect(() => {
    fetchNotifications();

    const refreshNotifications = () => {
      fetchNotifications();
    };

    socket.on(
      "newMessage",
      refreshNotifications
    );

    socket.on(
      "workerAssigned",
      refreshNotifications
    );

    socket.on(
      "statusUpdated",
      refreshNotifications
    );

    return () => {
      socket.off(
        "newMessage",
        refreshNotifications
      );

      socket.off(
        "workerAssigned",
        refreshNotifications
      );

      socket.off(
        "statusUpdated",
        refreshNotifications
      );
    };
  }, [fetchNotifications]);

  // Mark All Read
  const markAllRead = async () => {
    try {
      await markNotificationsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
        }))
      );

      await fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    notifications,
    markAllRead,
    fetchNotifications,
  };
};

export default useNotifications;