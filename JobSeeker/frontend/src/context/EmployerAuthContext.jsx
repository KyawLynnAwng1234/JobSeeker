import { createContext, useState, useEffect } from "react";
import { registerEmployer } from "../utils/api/employerAPI";
import { registerEmployerDetail } from "../utils/api/employerAPI";

export const EmployerAuthContext = createContext();

export const EmployerAuthProvider = ({ children }) => {
  const [employer, setEmployer] = useState(() => {
    const saved = localStorage.getItem("employerUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (employer) {
      localStorage.setItem("employerUser", JSON.stringify(employer));
    } else {
      localStorage.removeItem("employerUser");
    }
  }, [employer]);

  const register = async (email, password) => {
    try {
      const data = await registerEmployer(email, password);
      const newUser = { email: data.email, password, is_verified: false };
      setEmployer(newUser);
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  const submitCompanyDetail = async (profile) => {
    const data = await registerEmployerDetail(profile);
    const updatedEmployer = { ...employer, ...profile, };
    setEmployer(updatedEmployer);
    return updatedEmployer;
  };

  const logout = () => {
    setEmployer(null);
  };

  return (
    <EmployerAuthContext.Provider value={{ employer, register, submitCompanyDetail, logout }}>
      {children}
    </EmployerAuthContext.Provider>
  );
};
