import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { Link } from "react-router-dom";

import {
  loginUser,
} from "../../services/authService";

import { useAuth } from "../../hooks/useAuth";

// Logo
import logo from "../../assets/logo.png";

const Login = () => {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (
    data
  ) => {
    try {
      const response =
        await loginUser(data);

      login(
        response,
        response.token
      );

      toast.success(
        "Login successful"
      );

      // Redirect by role
      if (
        response.role ===
        "admin"
      ) {
        navigate(
          "/admin/dashboard"
        );
      } else if (
        response.role ===
        "worker"
      ) {
        navigate(
          "/worker/dashboard"
        );
      } else {
        navigate(
          "/user/dashboard"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Login failed"
      );
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100 px-4 py-6">
    
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-3 border border-gray-100">
      
      {/* Logo */}
      <div className="flex flex-col items-center">
        <img
          src={logo}
          alt="ComplaintMS"
          className="w-30 h-20 object-contain"
        />

        <h1 className="text-4xl font-extrabold text-gray-800 mt-3 tracking-tight">
          ComplaintMS
        </h1>

        <p className="text-gray-500 mt-1 text-center text-sm">
         Complaint
          Management Syatem
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-[1px] bg-gray-200"></div>

        <span className="text-gray-400 text-xs tracking-widest">
          LOGIN
        </span>

        <div className="flex-1 h-[1px] bg-gray-200"></div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-4"
      >
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none px-4 py-3 rounded-2xl transition-all duration-300"
            {...register("email")}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none px-4 py-3 rounded-2xl transition-all duration-300"
            {...register(
              "password"
            )}
          />
        </div>

        {/* Button */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-semibold text-lg transition duration-300 shadow-lg hover:shadow-indigo-300">
          Login
        </button>
      </form>

      {/* Register */}
      <p className="text-center mt-6 text-gray-500 text-sm">
        Don&apos;t have an
        account?{" "}
        <Link
          to="/register"
          className="text-indigo-600 font-bold hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  </div>
);
};

export default Login;