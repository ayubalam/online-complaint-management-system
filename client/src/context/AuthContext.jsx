import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { AuthContext } from "./authContext";

import socket from "../services/socket";

import useNotifications from "../hooks/useNotifications";

export const AuthProvider = ({
  children,
}) => {
  const { addNotification } =
    useNotifications();

  const [user, setUser] =
    useState(() => {
      const storedUser =
        localStorage.getItem(
          "user"
        );

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    });

  // Socket Connection
  useEffect(() => {
    if (!user?._id) return;

    // Join Room
    socket.emit(
      "join",
      user._id
    );

    console.log(
      "Socket Joined:",
      user._id
    );

    // Worker Assignment Listener
    const handleWorkerAssigned =
      (complaint) => {
        console.log(
          "Worker Notification:",
          complaint
        );

        addNotification(
          `New complaint assigned: ${complaint.title}`
        );

        toast.success(
          `New complaint assigned: ${complaint.title}`
        );
      };

    // Status Update Listener
    const handleStatusUpdated =
      (complaint) => {
        console.log(
          "Status Notification:",
          complaint
        );

        addNotification(
          `Complaint updated to ${complaint.status}`
        );

        toast.success(
          `Complaint updated to ${complaint.status}`
        );
      };

    // Register Listeners
    socket.on(
      "workerAssigned",
      handleWorkerAssigned
    );

    socket.on(
      "statusUpdated",
      handleStatusUpdated
    );

    // Cleanup
    return () => {
      socket.off(
        "workerAssigned",
        handleWorkerAssigned
      );

      socket.off(
        "statusUpdated",
        handleStatusUpdated
      );
    };
  }, [user, addNotification]);

  // Login
  const login = (
    userData,
    token
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      token
    );

    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};