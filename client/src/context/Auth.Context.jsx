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
      console.log("Token before saving to localStorage:", token); // Debug log
      console.log("User before saving to localStorage:", user); // Debug log
      localStorage.setItem("token", token);
    } catch (error) {
      throw error.response.data.message || "Login failed";
    }
  };

  const SignUp = async (username, password, fullname, email) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/signup",
        {
          username,
          password,
          fullname,
          email,
        }
      );
      const { token, user } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      throw error.response.data.message || "Sign up failed";
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
