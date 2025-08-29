import React, { createContext, useState, useEffect } from "react";
import {
  employerLoginAPI,
  employerRegisterAPI,
  employerProfileAPI,
  employerLogoutAPI,
} from "../utils/api/employerAPI";

export const EmployerAuthContext = createContext();

export const EmployerAuthProvider = ({ children }) => {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👉 Load profile from token
  useEffect(() => {
    const token = localStorage.getItem("employerToken");
    if (token) {
      employerProfileAPI(token)
        .then((data) => setEmployer(data))
        .catch(() => {
          localStorage.removeItem("employerToken");
          setEmployer(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 👉 Register
  const register = async (data) => {
    const res = await employerRegisterAPI(data);
    return res;
  };

  // 👉 Login
  const login = async (data) => {
    const res = await employerLoginAPI(data);
    localStorage.setItem("employerToken", res.token);
    setEmployer(res.user);
    return res;
  };

  // 👉 Logout
  const logout = async () => {
    const token = localStorage.getItem("employerToken");
    if (token) await employerLogoutAPI(token);
    localStorage.removeItem("employerToken");
    setEmployer(null);
  };

  return (
    <EmployerAuthContext.Provider
      value={{ employer, register, login, logout, loading }}
    >
      {children}
    </EmployerAuthContext.Provider>
  );
};
