// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInAPI,
  verifyOTPAPI,
  fetchProfileAPI,
  logoutAPI,
} from "../utils/api/jobseekerAPI";

// Create Auth Context => so other components can consume it using useAuth()
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // State to hold user data
  const [user, setUser] = useState(null);
  // State to handle loading status (when API calls are in progress)
  const [loading, setLoading] = useState(false);
  // State to display messages (success/error)
  const [message, setMessage] = useState("");

  // ---------------------- Sign In Function ----------------------
  const signIn = async (email) => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      // Call backend API to send OTP
      await signInAPI(email);
      // Show success message
      setMessage("SignIn successful! Check your email for OTP.");
      // Redirect to verify page with email
      navigate("/verify", { state: { email } });
    } catch (err) {
      console.error(err);
      // Display specific error message for rate limiting
      if (err.message && err.message.includes("Too many attempts")) {
        setMessage(err.message);
      } else {
        setMessage("SignIn failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

   // ---------------------- Verify OTP Function ----------------------
  const verifyOTP = async (email, otp) => {
    if (otp.length !== 6) {
      setMessage("Enter the 6-digit code.");
      return false;
    }
    setLoading(true);
    setMessage("");
    try {
      // Call backend to verify OTP => should return token + user
      const { token, user } = await verifyOTPAPI(otp);
      // Save token in localStorage
      localStorage.setItem("token", token);
      // Store user in state
      setUser(user);
      setMessage("Verification successful!");
      // Redirect to homepage
      navigate("/", { replace: true });
      return true;
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Verification failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Auto Fetch User Profile ----------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      // If token exists, fetch user profile and update state
      setLoading(true);
      fetchProfileAPI()
        .then((data) => setUser(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // ---------------------- Logout Function ----------------------
  const logout = async () => {
    try {
      // Call backend logout API
      await logoutAPI();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Remove token from localStorage
      localStorage.removeItem("token");
      // Reset user state
      setUser(null);
      // Redirect to homepage
      navigate("/");
    }
  };

   // ---------------------- Provide Context ----------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        message,
        signIn,
        verifyOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
