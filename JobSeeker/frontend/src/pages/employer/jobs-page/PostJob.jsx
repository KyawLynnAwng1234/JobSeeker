// src/pages/jobs/PostJob.jsx
import React from "react";
import JobForm from "../../../components/employer/jobs/JobForm";

export default function PostJob() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <JobForm />
    </div>
  );
}
