// src/utils/api/jobAPI.js
import api from "../axiosInstance";
import {
  JOBS_ENDPOINT,
  JOB_CREATE,
  JOB_DETAIL,
  JOB_UPDATE,
  JOB_DELETE,
} from "../constants/apiJobendpoints";

export const createJob = (data) => api.post(JOB_CREATE, data);   // 👈 /jobs/create/
export const getJobs = () => api.get(JOBS_ENDPOINT);
export const getJobDetail = (id) => api.get(JOB_DETAIL(id));
export const updateJob = (id, data) => api.put(JOB_UPDATE(id), data);
export const deleteJob = (id) => api.delete(JOB_DELETE(id));
