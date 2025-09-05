// src/utils/api/jobAPI.js
import api from "../axiosInstance";
import { JOBS_ENDPOINT, JOB_DETAIL } from "../../utils/constants/apiJobendpoints";

export const createJob = (data) => api.post(JOBS_ENDPOINT, data);
export const getJobs = () => api.get(JOBS_ENDPOINT);
export const getJobDetail = (id) => api.get(JOB_DETAIL(id));
export const updateJob = (id, data) => api.put(JOB_DETAIL(id), data);
export const deleteJob = (id) => api.delete(JOB_DETAIL(id));