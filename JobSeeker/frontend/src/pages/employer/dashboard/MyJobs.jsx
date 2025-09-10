// src/components/MyJobs.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import PostJob from "./PostJob";

// CSRF token ကို cookie ကနေယူ
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
  const [showPostJob, setShowPostJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // detail/edit state

  // fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/job/jobs/");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  // truncate description
  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  // handle new job created
  const handleJobCreated = (newJob) => {
    setJobs((prev) => [...prev, newJob]);
    setShowPostJob(false);
  };

  // delete job
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/job/jobs/delete/${id}/`, {
      headers: {
        "X-CSRFToken": csrftoken,
      },
      withCredentials: true,
    });
    setJobs((prev) => prev.filter((job) => job.id !== id));
  } catch (err) {
    console.error("Error deleting job:", err);
  }
};

  // show details
  const handleDetail = (job) => {
    setSelectedJob(job);
  };

  // show edit form (reuse PostJob later if needed)
  const handleEdit = (job) => {
    alert(`Edit form for: ${job.title} (todo: connect PostJob for editing)`);
  };

  return (
    <div>
      {showPostJob ? (
        <PostJob
          onBack={() => setShowPostJob(false)}
          onJobCreated={handleJobCreated}
        />
      ) : selectedJob ? (
        // ✅ Detail View
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Job Detail</h2>
          <p><b>Title:</b> {selectedJob.title}</p>
          <p><b>Job Type:</b> {selectedJob.job_type}</p>
          <p><b>Location:</b> {selectedJob.location}</p>
          <p><b>Salary:</b> {selectedJob.salary || "N/A"}</p>
          <p>
            <b>Deadline:</b>{" "}
            {selectedJob.deadline
              ? new Date(selectedJob.deadline).toLocaleDateString()
              : "N/A"}
          </p>
          <p><b>Category:</b> {selectedJob.category || "N/A"}</p>
          <p><b>Description:</b> {selectedJob.description}</p>
          <p>
            <b>Employer:</b>{" "}
            {selectedJob.employer?.username ||
              selectedJob.employer?.email ||
              selectedJob.employer ||
              "N/A"}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setSelectedJob(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={() => handleEdit(selectedJob)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(selectedJob.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        // ✅ Job List Table
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
                        <td className="p-3">
                          {job.category?.name || job.category || "N/A"}
                        </td>
                        <td className="p-3">
                          {truncateText(job.description, 10)}
                        </td>
                        <td className="p-3">
                          {job.employer?.username ||
                            job.employer?.email ||
                            job.employer ||
                            "N/A"}
                        </td>
                        <td className="p-3 space-x-2">
                          <button
                            onClick={() => handleDetail(job)}
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

            {/* Add Job Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPostJob(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Post a Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
