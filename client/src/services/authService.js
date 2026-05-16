import axiosInstance from "./axiosInstance";


// Register
export const registerUser = async (
  userData
) => {
  const response =
    await axiosInstance.post(
      "/auth/register",
      userData
    );

  return response.data;
};


// Login
export const loginUser = async (
  userData
) => {
  const response =
    await axiosInstance.post(
      "/auth/login",
      userData
    );

  return response.data;
};