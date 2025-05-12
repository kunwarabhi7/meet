import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const navigate = useNavigate();
  const isAuthenticated = false; // Placeholder - baad mein AuthContext se lenge

  const handleLogout = () => {
    // Placeholder logout logic - baad mein AuthContext se integrate karenge
    // Clear token, user, etc.
    navigate("/login");
  };

  // Common class for links (used for both desktop and mobile)
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-teal-600 px-3 py-2 rounded-md text-sm font-medium"
      : "text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition";

  return (
    <nav className="bg-teal-50 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <NavLink
              to="/"
              className="text-2xl font-bold text-teal-700 hover:text-teal-600 transition"
            >
              Let's MEET 🧑‍🤝‍🧑
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="text-teal-900 bg-amber-400 hover:bg-amber-500 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-teal-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden bg-teal-50 shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "block text-teal-600 px-3 py-2 rounded-md text-base font-medium"
                : "block text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium transition"
            }
          >
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "block text-teal-600 px-3 py-2 rounded-md text-base font-medium"
                    : "block text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium transition"
                }
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "block text-teal-600 px-3 py-2 rounded-md text-base font-medium"
                    : "block text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium transition"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="block text-teal-900 bg-amber-400 hover:bg-amber-500 px-3 py-2 rounded-md text-base font-medium transition"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
