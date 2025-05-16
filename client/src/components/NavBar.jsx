import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";

const Navbar = () => {
  const { user, Logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    Logout();
    navigate("/login");
  };
  console.log(user, "user");

  return (
    <nav className="bg-teal-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Let's Meet
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-amber-400">
                Dashboard
              </Link>
              <Link to="/profile" className="text-white hover:text-amber-400">
                Profile
              </Link>
              <span className="text-white">
                Welcome, {user?.user?.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-amber-500 text-white px-3 py-1 rounded-md hover:bg-amber-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-amber-400">
                Login
              </Link>
              <Link to="/signup" className="text-white hover:text-amber-400">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
