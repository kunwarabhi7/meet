import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/user/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Fetched User:", response.data); // Debug
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error.response?.data);
          Logout();
        }
      }
      setIsLoading(false); // Set loading false after fetch
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
      setUser({ user });
      setToken(token);
      localStorage.setItem("token", token);
      setIsLoading(false);
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
      setUser({ user });
      setToken(token);
      localStorage.setItem("token", token);
      setIsLoading(false);
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      setIsLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      console.log("Sending Payload:", userData);
      const response = await axios.put(
        "http://localhost:3000/api/user/profile",
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Backend Response:", response.data);
      setUser({ user: response.data.user });
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.log(
        "Error updating user:",
        error.response?.data,
        error.response?.status
      );
      const errorData =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      throw typeof errorData === "string"
        ? errorData
        : JSON.stringify(errorData);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, Login, Logout, SignUp, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
