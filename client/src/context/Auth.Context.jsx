import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/user/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data); // Assuming response.data is { user: { ... } }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  const Login = async (usermail, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        {
          usermail,
          password,
        }
      );
      const { token, user } = response.data;
      setUser({ user }); // Wrap user in object to match structure
      setToken(token);
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      console.log("Login error:", error.response?.data);
      const errorData =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Login failed";
      throw typeof errorData === "string"
        ? errorData
        : JSON.stringify(errorData);
    }
  };

  const SignUp = async (username, password, fullName, email) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/signup",
        {
          username,
          password,
          fullName,
          email,
        }
      );
      const { token, user } = response.data;
      setUser({ user }); // Wrap user in object
      setToken(token);
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      console.log("Signup error:", error.response?.data);
      const errorData =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Sign up failed";
      throw typeof errorData === "string"
        ? errorData
        : JSON.stringify(errorData);
    }
  };

  const Logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/user/profile",
        userData, // { bio, fullName, profilePicture }
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser({ user: response.data.user }); // Update with nested structure
      return response.data; // Return for frontend to handle success
    } catch (error) {
      console.log("Error updating user:", error.response?.data);
      const errorData =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Failed to update profile";
      throw typeof errorData === "string"
        ? errorData
        : JSON.stringify(errorData);
    }
  };

  return (
    <AuthContext.Provider value={{ user, Login, Logout, SignUp, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
