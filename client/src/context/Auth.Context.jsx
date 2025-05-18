import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token" || null));

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
          setUser(response.data);
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
      console.log(response, "response");
      const { token, user } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      console.log("Login error:", error.response?.data);
      // Handle both errors and message fields
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
      console.log(response, "response");
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      console.log("Signup error:", error.response?.data);
      // Handle both errors and message fields
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
  return (
    <AuthContext.Provider value={{ user, Login, Logout, SignUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
