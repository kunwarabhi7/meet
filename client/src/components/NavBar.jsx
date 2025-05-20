import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";

const Navbar = () => {
  const { user, Logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Logout();
    navigate("/login");
  };

  console.log("User in Navbar:", user, "IsLoading:", isLoading);

  if (isLoading) {
    return (
      <nav className="bg-teal-700 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Let's Meet
          </Link>
          <div className="text-white animate-pulse">Loading...</div>
        </div>
      </nav>
    );
  }

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
              <div className="flex items-center space-x-2">
                <img
                  src={
                    user?.user?.profilePicture ||
                    "https://via.placeholder.com/40"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                />
                <span className="text-white">
                  Welcome, {user?.user?.fullName || "User"}
                </span>
              </div>
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
