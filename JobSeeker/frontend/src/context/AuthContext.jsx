import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInAPI,
  verifyOTPAPI,
  fetchProfileAPI,
  logoutAPI,
} from "../utils/api/jobseekerAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

<<<<<<< HEAD
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
=======
  // State to hold user data
  const [user, setUser] = useState(undefined);
  // State to handle loading status (when API calls are in progress)
  const [loading, setLoading] = useState(true);
  // State to display messages (success/error)
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
  const [message, setMessage] = useState("");

  // ---------------------- Sign In ----------------------
  const signIn = async (email) => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await signInAPI(email);
      setMessage("Sign in successful! Check your email for OTP.");
      navigate("/verify", { state: { email } });
    } catch (err) {
      console.error("SignIn Error:", err);
      setMessage("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // ---------------------- Verify OTP ----------------------
=======
  // ---------------------- Verify OTP Function ----------------------
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
  const verifyOTP = async (email, otp) => {
    if (otp.length !== 6) {
      setMessage("Enter the 6-digit code.");
      return false;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await verifyOTPAPI(otp);
      console.log("✅ verifyOTPAPI response =", response);

      const token = response.token || response.access;
      localStorage.setItem("token", token);
      setToken(token);

      const profileData = await fetchProfileAPI();
      console.log("✅ fetched current user =", profileData);

      setUser(profileData);

      setMessage("Verification successful!");

      navigate("/", { replace: true });

      return true;
    } catch (err) {
      console.error("Verify OTP Error:", err);
      setMessage(err.response?.data?.error || "Verification failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Auto Fetch User ----------------------
  useEffect(() => {
<<<<<<< HEAD
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }
    setToken(savedToken);
    fetchProfileAPI()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Fetch profile error:", err);
=======
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfileAPI()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err);
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---------------------- Logout ----------------------
  const logout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  // ---------------------- Provide Context ----------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
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
