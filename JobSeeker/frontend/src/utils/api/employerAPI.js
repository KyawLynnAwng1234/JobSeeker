import axios from "axios";
import { EMPLOYER_API } from "../constants/employerConstants";

// CSRF token helper
const getCSRFToken = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  return cookieValue;
};

const EMPLOYER_API_URL = import.meta.env.VITE_API_URL;


// 👉 Register
export const employerRegisterAPI = async (data) => {
  const res = await axios.post(
    `${EMPLOYER_API_URL}${EMPLOYER_API.REGISTER}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      withCredentials: true,
    }
  );
  return res.data;
};


// 👉 Login
export const employerSignInAPI =  async (data) => {
  const res = await axios.post(
    `${EMPLOYER_API_URL}${EMPLOYER_API.SIGNIN}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      withCredentials: true,
    }
  );
  return res.data;
};




// 👉 Fetch profile
export const employerProfileAPI = async (token) => {
  const res = await axios.get(`${EMPLOYER_API_URL}${EMPLOYER_API.PROFILE}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
};

// 👉 Company Detail
export const employerCompanyDetailAPI = async (data, token) => {
  const res = await axios.post(
    `${EMPLOYER_API_URL}${EMPLOYER_API.COMPANY_DETAIL}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRFToken": getCSRFToken(),
      },
      withCredentials: true,
    }
  );
  return res.data;
};

// 👉 Logout
export const employerLogoutAPI = async (token) => {
  const res = await axios.post(
    `${EMPLOYER_API_URL}${EMPLOYER_API.LOGOUT}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRFToken": getCSRFToken(),
      },
    }
  );
  return res.data;
};
