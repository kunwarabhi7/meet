import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";
import { Menu, X } from "lucide-react"; // For hamburger menu icons

const Navbar = () => {
  const { user, Logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    Logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  console.log("User in Navbar:", user, "IsLoading:", isLoading);

  if (isLoading) {
    return (
      <nav className="bg-teal-700 dark:bg-teal-900 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-white dark:text-teal-300 text-2xl font-extrabold tracking-tight animate-fade-in-down"
          >
            Let's Meet
          </Link>
          <div className="text-white dark:text-teal-300 text-lg animate-pulse">
            Loading...
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-teal-700 dark:bg-teal-900 p-4 shadow-xl border-b border-teal-200 dark:border-teal-700 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-white dark:text-teal-300 text-2xl font-extrabold tracking-tight animate-fade-in-down"
        >
          Let's Meet
        </Link>

        {/* Hamburger Menu Button (Mobile) */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300 font-semibold transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300 font-semibold transition-colors duration-200"
              >
                Profile
              </Link>
              <div className="flex items-center space-x-3">
                <img
                  src={user?.profilePicture || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 shadow-sm"
                />
                <span className="text-white dark:text-teal-300 font-medium">
                  Welcome, {user?.fullName || "User"}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-amber-600 dark:hover:bg-amber-500 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-300"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300 font-semibold transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300 font-semibold transition-colors duration-200"
              >
                Signup
              </Link>
            </>
          )}
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-teal-700 dark:bg-teal-900 p-4 border-t border-teal-200 dark:border-teal-700 animate-fade-in-down">
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300 font-semibold text-lg transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300 font-semibold text-lg transition-colors duration-200"
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      user?.profilePicture || "https://via.placeholder.com/40"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 shadow-sm"
                  />
                  <span className="text-white dark:text-teal-300 font-medium">
                    Welcome, {user?.fullName || "User"}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  className="bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-amber-600 dark:hover:bg-amber-500 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-300"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300 font-semibold text-lg transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white dark:text-teal-300 hover:text-amber-400 dark:hover:text-amber-300 font-semibold text-lg transition-colors duration-200"
                >
                  Signup
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
