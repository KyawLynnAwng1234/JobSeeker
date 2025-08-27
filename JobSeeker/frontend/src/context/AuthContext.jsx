// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInAPI,
  verifyOTPAPI,
  fetchProfileAPI,
  logoutAPI,
} from "../utils/api";

// ⛔ Old (error ဖြစ်နေတဲ့အခြေအနေ)
// const AuthContext = createContext();

// ✅ New (named export ပြန်ပေးလိုက်ပါ)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Sign In Function
  const signIn = async (email) => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await signInAPI(email);
      setMessage("SignIn successful! Check your email for OTP.");
      navigate("/verify", { state: { email } });
    } catch (err) {
      console.error(err);
      setMessage("SignIn failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //   VerifyOTP function
  const verifyOTP = async (email, otp) => {
    if (otp.length !== 6) {
      setMessage("Enter the 6-digit code.");
      return false;
    }
    setLoading(true);
    setMessage("");
    try {
      const { token, user } = await verifyOTPAPI(otp);

      // Save Token
      localStorage.setItem("token", token);
      // Update User
      setUser(user);

      setMessage("Verification successful!");
      navigate("/", { replace: true });
      return true;
    } catch (err) {
      console.error(err);
      setUser(res.data.user);
      setMessage(err.response?.data?.error || "Verification failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // load profile if token exits
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetchProfileAPI()
        .then((data) => setUser(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // ✅ Logout
  const logout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, message, signIn, verifyOTP, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
