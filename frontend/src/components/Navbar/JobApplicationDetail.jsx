// src/pages/JobApplicationDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function JobApplicationDetail() {
  const { id } = useParams(); // application id
  const [applicationDetail, setApplicationDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApplicationDetail() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/application/application/apply/job/detail/${id}/`,
          { withCredentials: true }
        );
        console.log("API Response:", response.data);
        // backend returns { application_detail: {...} }
        setApplicationDetail(response.data.application_detail);
      } catch (error) {
        console.error("Failed to load job application detail:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplicationDetail();
  }, [id]);

  if (loading) return <p className="p-8 text-center">Loading job application detail...</p>;
  if (!applicationDetail) return <p className="p-8 text-center">Job application not found.</p>;

  const {
    job_title,
    employer_company,
    status,
    cover_letter_text,
    applied_at,
    resume_form,
    resume_upload,
    job, // this is job id (uuid)
  } = applicationDetail;

  return (
    <div className="container mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 underline text-sm">
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-2">{job_title || `Job ID: ${job}`}</h1>
      {employer_company && <p className="text-gray-600">{employer_company}</p>}
      <p className="text-gray-500 text-sm mb-3">Applied at: {applied_at ? new Date(applied_at).toLocaleString() : "—"}</p>

      <div className="bg-gray-50 p-5 rounded-lg border">
        <p className="text-gray-700 mb-2">
          <strong>Status:</strong>{" "}
          {status === "P" ? "Pending" : status === "A" ? "Approved" : status === "R" ? "Rejected" : status}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Resume Form:</strong> {resume_form?.basic ? "Basic" : "Custom"}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Resume Upload:</strong>{" "}
          {resume_upload ? (
            <a href={`http://127.0.0.1:8000${resume_upload}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View File
            </a>
          ) : (
            "No File"
          )}
        </p>

        <p className="text-gray-700 mt-4">
          <strong>Cover Letter:</strong>
        </p>
        <p className="text-gray-700 mt-2 whitespace-pre-wrap">{cover_letter_text || "—"}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate(`/job-search/${job}`)} className="bg-[#D2691E] hover:bg-[#b45717] text-white py-2 px-6 rounded-md">
          View Job Post
        </button>

        <button onClick={() => window.print()} className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-md">
          Print
        </button>
      </div>
    </div>
  );
}
