import { Link } from "react-router-dom";
import { FaCalendarAlt, FaBell, FaUsers } from "react-icons/fa";
import { useAuth } from "../context/Auth.Context";

const Home = () => {
  const { user } = useAuth();
  console.log(user, "homeee");
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section with Image */}
      <section
        className="relative bg-cover bg-center py-24 text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700/80 to-teal-500/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-fade-in-down">
            Let's Meet
          </h1>
          <p className="text-lg sm:text-xl mb-8 animate-fade-in-up">
            Plan Events, Sync Teams, Celebrate Together
          </p>
          {!user && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup"
                className="inline-block px-8 py-3 bg-amber-400 text-teal-900 font-semibold rounded-md shadow-md hover:bg-amber-500 transition animate-fade-in-up"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-teal-600 text-white font-semibold rounded-md shadow-md hover:bg-teal-700 transition animate-fade-in-up"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose Let's Meet🧑‍🤝‍🧑?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <FaCalendarAlt className="text-4xl text-teal-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Easy Event Planning
              </h3>
              <p className="text-gray-600">
                Create and manage events with a simple and intuitive interface.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <FaBell className="text-4xl text-teal-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Smart Reminders
              </h3>
              <p className="text-gray-600">
                Never miss an event with timely notifications and reminders.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <FaUsers className="text-4xl text-teal-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Collaborate with Teams
              </h3>
              <p className="text-gray-600">
                Share events and collaborate with your team effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default Home;
