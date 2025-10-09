import React, { useState, useEffect } from "react";
import { getJobs, deleteJob } from "../../../utils/api/jobAPI";
import { useNavigate } from "react-router-dom";
import JobDeleteModal from "../../../components/employer/jobs/JobDeleteModal";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getJobs();
        console.log(res.data);
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchData();
  }, []);

  // const truncateText = (text, limit) =>
  //   !text ? "" : text.length > limit ? text.substring(0, limit) + "..." : text;

  const confirmDelete = (id) => {
    setJobToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteJob(id, csrftoken);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    } finally {
      setShowConfirm(false);
      setJobToDelete(null);
    }
  };

  const handleDetail = (id) => {
    // ✅ route navigate to JobDetail
    navigate(`/employer/dashboard/my-jobs/${id}/detail`);
  };

  const handleEdit = (job) =>
    navigate(`/employer/dashboard/my-jobs/${job.id}/edit`);

  const columns = [
    { key: "title", label: "Title" },
    { key: "job_type", label: "Job Function" },
    { key: "deadline", label: "Deadline" },
    { key: "employer", label: "Employer" },
  ];

  return (
    <div>
      <div className="m-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        {/* Post a Job button → navigate to route */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/employer/dashboard/job-create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Create a Job
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md p-6 m-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th key={column.key} className="p-3">
                    {column.label}
                  </th>
                ))}
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b">
                    {columns.map((col) => (
                      <td key={col.key} className="p-3">
                        {col.key === "deadline"
                          ? job.deadline
                            ? new Date(job.deadline).toLocaleDateString()
                            : "N/A"
                          : job[col.key] || "N/A"}
                      </td>
                    ))}
                    <td className="p-3 space-x-4">
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
                        onClick={() => confirmDelete(job.id)}
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
      </div>

      <JobDeleteModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(jobToDelete)}
        title="Confirm Delete"
        message="Are you sure you want to delete this job?"
      />
    </div>
  );
}
