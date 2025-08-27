// src/api.js
import axios from "axios";
import { API_URL } from "./constants";

// ✅ Cookie getter (CSRF token)
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ✅ SignIn API
export async function signInAPI(email) {
  const res = await fetch(`${API_URL}/signin-jobseeker/job_seeker/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}


// ✅ Verify OTP API
export async function verifyOTPAPI(otp) {
  const res = await axios.post(
    `${API_URL}/email-verify-jobseeker/`,
    { code: otp },
    {
      withCredentials: true,
      headers: { "X-CSRFToken": getCookie("csrftoken") },
    }
  );
  return res.data;
}

// ✅ Current User
export async function fetchProfileAPI() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/current-user/`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
}

// ✅ Logout
export async function logoutAPI() {
  const token = localStorage.getItem("token");
  return axios.post(
    `${API_URL}/logout-jobseeker/`,
    {},
    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
  );
}
