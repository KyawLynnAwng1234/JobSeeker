import React, { useState, useEffect } from "react";
import { getJobs, deleteJob } from "../../../utils/api/jobAPI";
import { useNavigate } from "react-router-dom";

// CSRF token function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie("csrftoken");

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getJobs();
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchData();
  }, []);

  const truncateText = (text, limit) =>
    !text ? "" : text.length > limit ? text.substring(0, limit) + "..." : text;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id, csrftoken);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleDetail = (id) => {
    // ✅ route navigate to JobDetail
    navigate(`/employer/dashboard/my-jobs/${id}/detail`);
  };

  const handleEdit = (job) => navigate(`/employer/dashboard/my-jobs/${job.id}/edit`);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Jobs</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3">Title</th>
                <th className="p-3">Job Function</th>
                <th className="p-3">Location</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Employer</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b">
                    <td className="p-3">{job.title}</td>
                    <td className="p-3">{job.job_type}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">{job.salary || "N/A"}</td>
                    <td className="p-3">
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">{job.category_name || "N/A"}</td>
                    <td className="p-3">{truncateText(job.description, 10)}</td>
                    <td className="p-3">{job.employer || "N/A"}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleDetail(job.id)}
                        className="text-green-600 hover:underline"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleEdit(job)}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-3 text-center">
                    No jobs posted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Post a Job button → navigate to route */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/employer/dashboard/job-create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Post a Job
          </button>
        </div>
      </div>
    </div>
  );
}
