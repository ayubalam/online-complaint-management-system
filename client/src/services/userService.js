import axiosInstance from "./axiosInstance";


// Get Workers
export const getWorkers =
  async () => {
    const response =
      await axiosInstance.get(
        "/users/workers"
      );

    return response.data;
  };


// Get Profile
export const getProfile =
  async () => {
    const response =
      await axiosInstance.get(
        "/users/profile"
      );

    return response.data;
  };


// Update Profile
export const updateProfile =
  async (formData) => {
    const response =
      await axiosInstance.put(
        "/users/profile",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };


// Get Notifications
export const getNotifications =
  async () => {
    const response =
      await axiosInstance.get(
        "/users/notifications"
      );

    return response.data;
  };


// Mark Notifications Read
export const markNotificationsRead =
  async () => {
    const response =
      await axiosInstance.put(
        "/users/notifications/read"
      );

    return response.data;
  };