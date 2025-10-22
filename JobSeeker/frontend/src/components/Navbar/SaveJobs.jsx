import { useEffect, useState } from "react";
import axios from "axios";
import { Bookmark, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function SaveJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        setLoading(true);
        setError(null);
        const csrftoken = getCookie("csrftoken");

        const response = await axios.get(
          "http://127.0.0.1:8000/application/saved/jobs/",
          {
            headers: {
              "X-CSRFToken": csrftoken,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const data = response.data;
        if (Array.isArray(data.s_savejobs)) {
          setJobs(data.s_savejobs);
        } else {
          console.warn("Unexpected response format:", data);
          setJobs([]);
        }
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
        setError("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    }

    fetchSavedJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const csrftoken = getCookie("csrftoken");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/application/saved/job/remove/${jobId}/`,
        {
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setJobs(jobs.filter((job) => job.id !== jobId));
      setMessage("✅ Job removed from saved list!");

      setTimeout(() => setMessage(null), 2500);
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (error)
    return <p className="p-8 text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-6 py-10 flex-grow">
        <h2 className="text-xl font-semibold mb-3">Jobs Saved</h2>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500/90 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Bookmark size={28} />
              </div>
            </div>
            <p className="text-gray-700 font-medium">No saved jobs yet.</p>
            <p className="text-gray-500 mt-1 text-sm">
              Save jobs you're interested in so you can come back to them later.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition relative"
              >
                <button
                  onClick={() => handleDelete(job.id)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                >
                  <Trash2 size={16} />
                </button>

                <h3 className="text-[16px] font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.category_name || "Uncategorized"}
                </p>
                <p className="text-sm font-medium mt-1">
                  {job.employer || "Unknown Company"}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button className="mt-2 bg-[#D2691E] hover:bg-[#b45717] text-white text-sm font-medium py-2 px-5 rounded-md">
                    Apply Now
                  </button>
                  <button
                    onClick={() => navigate(`/job-search/saved/${job.id}`)}
                    className="mt-2 bg-[#D2691E] hover:bg-[#b45717] text-white text-sm font-medium py-2 px-5 rounded-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
