import {
  useEffect,
  useState,
} from "react";

import socket from "../services/socket";

import {
  getNotifications,
  markNotificationsRead,
} from "../services/userService";

const useNotifications =
  () => {
    const [
      notifications,
      setNotifications,
    ] = useState([]);

    // Fetch Notifications
    const fetchNotifications =
      async () => {
        try {
          const data =
            await getNotifications();

          setNotifications(
            data
          );
        } catch (error) {
          console.log(error);
        }
      };

    // Initial Fetch
    useEffect(() => {
      fetchNotifications();
    }, []);

    // Realtime Notification Updates
    useEffect(() => {
      socket.on(
        "newMessage",
        () => {
          fetchNotifications();
        }
      );

      socket.on(
        "workerAssigned",
        () => {
          fetchNotifications();
        }
      );

      socket.on(
        "statusUpdated",
        () => {
          fetchNotifications();
        }
      );

      return () => {
        socket.off(
          "newMessage"
        );

        socket.off(
          "workerAssigned"
        );

        socket.off(
          "statusUpdated"
        );
      };
    }, []);

    // Mark All Read
    const markAllRead =
      async () => {
        try {
          await markNotificationsRead();

          // Instant UI Update
          const updated =
            notifications.map(
              (item) => ({
                ...item,
                read: true,
              })
            );

          setNotifications(
            updated
          );

          // Backend Sync
          await fetchNotifications();
        } catch (error) {
          console.log(error);
        }
      };

    return {
      notifications,

      markAllRead,

      fetchNotifications,
    };
  };

export default useNotifications;