// src/components/jobs/JobDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobDetail } from "../../../utils/api/jobAPI";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobDetail(id)
      .then((res) => setJob(res.data))
      .catch((err) => console.error("Error fetching job detail:", err));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
      <p><b>Job Type:</b> {job.job_type}</p>
      <p><b>Location:</b> {job.location}</p>
      <p><b>Salary:</b> {job.salary || "N/A"}</p>
      <p><b>Deadline:</b> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</p>
      <p><b>Category:</b> {job.category?.name || "N/A"}</p>
      <p><b>Description:</b> {job.description}</p>
      <p><b>Employer:</b> {job.employer?.username || job.employer?.email || "N/A"}</p>
    </div>
  );
}
