import axios from "axios";
import { EMPLOYER_API } from "../constants/employerConstants";

const EMPLOYER_API_URL = import.meta.env.VITE_API_URL;

// 👉 Register
export const employerRegisterAPI = async (data) => {
  const res = await axios.post(`${EMPLOYER_API_URL}${EMPLOYER_API.REGISTER}`, data);
  return res.data;
};

// 👉 Login
export const employerLoginAPI = async (data) => {
  const res = await axios.post(`${EMPLOYER_API_URL}${EMPLOYER_API.LOGIN}`, data);
  return res.data;
};

// 👉 Fetch profile
export const employerProfileAPI = async (token) => {
  const res = await axios.get(`${EMPLOYER_API_URL}${EMPLOYER_API.PROFILE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 👉 Company Detail
export const employerCompanyDetailAPI = async (data, token) => {
  const res = await axios.post(`${EMPLOYER_API_URL}${EMPLOYER_API.COMPANY_DETAIL}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 👉 Logout
export const employerLogoutAPI = async (token) => {
  const res = await axios.post(
    `${EMPLOYER_API_URL}${EMPLOYER_API.LOGOUT}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
