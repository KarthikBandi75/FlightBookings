import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const loadUserProfileData = useCallback(async () => {
    if (!token) return;

    setIsLoadingProfile(true);
    try {
      const { data } = await axios.get("https://flightbookings-backend.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.user) {
        setUserData(data.user);
      } else {
        console.warn("No user data in response:", data);
        toast.error(data.message || "Failed to load user profile");
        setToken("");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error(error.response?.data?.message || "Error fetching user profile");
      setToken("");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
      setIsLoadingProfile(false);
    }
  }, [token, loadUserProfileData]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  
  const contextValue = {
    token,
    setToken,
    userData,
    setUserData,
    isLoadingProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;