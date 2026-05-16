import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";


const MobileMenu = ({ isOpen }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();


  if (!isOpen) return null;


  const handleLogout = () => {
    logout();

    navigate("/login");
  };


  return (
    <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-4">
      <Link
        to="/"
        className="block text-gray-700"
      >
        Home
      </Link>

      {user ? (
        <>
          <Link
            to={`/${user.role}/dashboard`}
            className="block text-gray-700"
          >
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="block text-gray-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="block bg-indigo-600 text-white px-4 py-2 rounded-lg text-center"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default MobileMenu;