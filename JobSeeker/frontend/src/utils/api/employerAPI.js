import axios from "axios";
import { EMPLOYER_API } from "../constants/employerConstants";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const API_URL = import.meta.env.VITE_API_URL;

export const registerEmployer = async (email, password) => {
  const csrftoken = getCookie("csrftoken");
  const response = await axios.post(
    `${API_URL}${EMPLOYER_API.REGISTER}`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const registerEmployerDetail = async (profile) => {
  const csrftoken = getCookie("csrftoken");
  const response = await axios.post(
    `${API_URL}${EMPLOYER_API.REGISTER_DETAIL}`,
    { profile },
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      withCredentials: true,
    }
  );
  return response.data;
};
