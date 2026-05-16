import { useForm } from "react-hook-form";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  registerUser,
} from "../../services/authService";

import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response =
        await registerUser(data);

      login(response, response.token);

      toast.success(
        "Registration successful"
      );

      reset();

      // Redirect by role
      if (response.role === "admin") {
        navigate("/admin/dashboard");
      } else if (
        response.role === "worker"
      ) {
        navigate("/worker/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Register
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-3 rounded-lg"
            {...register("name")}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            {...register("email")}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            {...register("password")}
          />

          <select
            className="w-full border p-3 rounded-lg"
            {...register("role")}
          >
            <option value="user">
              User
            </option>

            <option value="worker">
              Worker
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;  