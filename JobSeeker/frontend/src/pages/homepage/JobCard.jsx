import { Save, ChevronDown } from "lucide-react";

export default function JobCard({ job }) {
  function getRelativeTime(dateString) {
    if (!dateString) return "No deadline";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date; // positive = past, negative = future
    const diffSec = Math.floor(diffMs / 1000);

    const minutes = Math.floor(diffSec / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    return "Just now";
  }

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{job.title}</h3>
      <p className="text-sm text-gray-600">
        {job.category_name || "Not specified"}
      </p>
      <p className="text-sm text-gray-600">
        {job.employer || "Unknown Company"}
      </p>
      <ul className="text-sm mt-2 list-disc list-inside text-gray-600">
        <li>{job.location || "No location"}</li>
        <li>${job.salary || "Negotiable"}</li>
        <li>{job.description || "No description available"}</li>
      </ul>
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-400">{getRelativeTime(job.deadline)}</p>
        <div className="flex items-center gap-3">
          <ChevronDown className="text-gray-500 cursor-pointer" />
          <Save className="text-blue-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
