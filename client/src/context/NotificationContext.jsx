import {
  createContext,
  useState,
} from "react";

// Context
const NotificationContext =
  createContext();

export default NotificationContext;

// Provider
export const NotificationProvider =
  ({ children }) => {
    const [
      notifications,
      setNotifications,
    ] = useState([]);

    // Add Notification
    const addNotification =
      (message) => {
        const newNotification = {
          id: Date.now(),
          message,
          read: false,
        };

        setNotifications(
          (prev) => [
            newNotification,
            ...prev,
          ]
        );
      };

    // Mark All Read
    const markAllRead = () => {
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
    };

    return (
      <NotificationContext.Provider
        value={{
          notifications,
          addNotification,
          markAllRead,
        }}
      >
        {children}
      </NotificationContext.Provider>
    );
  };