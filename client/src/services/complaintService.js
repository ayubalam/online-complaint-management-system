import axiosInstance from "./axiosInstance";


// Create Complaint
export const createComplaint =
  async (complaintData) => {
    const response =
      await axiosInstance.post(
        "/complaints",
        complaintData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };


// User Complaints
export const getUserComplaints =
  async () => {
    const response =
      await axiosInstance.get(
        "/complaints/my"
      );

    return response.data;
  };


// Admin Complaints
export const getAllComplaints =
  async () => {
    const response =
      await axiosInstance.get(
        "/complaints/all"
      );

    return response.data;
  };


// Send Complaint Message
export const sendComplaintMessage =
  async (
    id,
    text
  ) => {
    const response =
      await axiosInstance.post(
        `/complaints/${id}/message`,
        { text }
      );

    return response.data;
  };


// Delete Complaint
export const deleteComplaint =
  async (id) => {
    const response =
      await axiosInstance.delete(
        `/complaints/${id}`
      );

    return response.data;
  };


// Hide Complaint History
export const hideComplaintHistory =
  async (id) => {
    const response =
      await axiosInstance.put(
        `/complaints/${id}/hide`
      );

    return response.data;
  };


// Update Complaint Status
export const updateComplaintStatus =
  async (
    id,
    statusData
  ) => {
    const response =
      await axiosInstance.put(
        `/complaints/${id}/status`,
        statusData
      );

    return response.data;
  };


// Assign Worker
export const assignWorker =
  async (
    id,
    workerId
  ) => {
    const response =
      await axiosInstance.put(
        `/complaints/${id}/assign`,
        { workerId }
      );

    return response.data;
  };


// Worker Complaints
export const getWorkerComplaints =
  async () => {
    const response =
      await axiosInstance.get(
        "/complaints/worker"
      );

    return response.data;
  };