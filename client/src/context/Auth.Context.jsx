import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../utils/axionInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          console.log("Fetching user with token:", token.slice(0, 20) + "...");
          const response = await axiosInstance.get("/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Fetched User:", JSON.stringify(response.data, null, 2));
          console.log("Response shape on /profile:", response.data);

          setUser(response.data.user);
        } catch (error) {
          console.error("Error fetching user data:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          console.log("Cleared token due to fetch error");
        }
      } else {
        console.log("No token found in localStorage");
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [token]);

  const Login = async (usermail, password) => {
    console.log(axiosInstance, "axiosss");
    try {
      console.log("Logging in with:", { usermail });
      const response = await axiosInstance.post("/user/login", {
        usermail,
        password,
      });
      const { token, user } = response.data;
      console.log("Login - User:", JSON.stringify(user, null, 2));
      console.log("Login - Token:", token.slice(0, 20) + "...");

      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
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
      const response = await axiosInstance.post("/user/signup", {
        username,
        password,
        fullName,
        email,
      });
      const { token, user } = response.data;
      console.log("SignUp - User:", JSON.stringify(user, null, 2)); // Debug
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
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
      await axiosInstance(
        "/user/logout",
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
      const response = await axiosInstance.put("/user/profile", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Backend Response:", JSON.stringify(response.data, null, 2));
      setUser(response.data.user);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
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
      value={{
        user,
        Login,
        Logout,
        SignUp,
        updateUser,
        isLoading,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
