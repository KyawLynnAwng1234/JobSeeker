import React from "react";
import { MapPin, Briefcase, DollarSign, CalendarDays } from "lucide-react";
import { CiMaximize1 } from "react-icons/ci";

export default function JobDetailView({
  job,
  isMaximized,
  onToggleMaximize,
  onApplyNow,
}) {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h4 className="font-semibold text-lg">Choose a job you like</h4>
        <p className="text-sm text-gray-500 mt-2">Detail here</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-gray-600">{job.employer || "Unknown Company"}</p>
        </div>
        <button onClick={onToggleMaximize}>
          <CiMaximize1 size={20} className="text-gray-600 cursor-pointer" />
        </button>
      </div>

      {/* Meta */}
      <div className="mt-4 space-y-2 text-gray-600 text-sm">
        <p className="flex items-center gap-2">
          <MapPin size={16} /> {job.location || "No location"}
        </p>
        <p className="flex items-center gap-2">
          <Briefcase size={16} /> {job.category_name || "Not specified"}
        </p>
        <p className="flex items-center gap-2">
          <DollarSign size={16} /> ${job.salary || "Negotiable"}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays size={16} /> {job.deadline ? `Deadline: ${job.deadline}` : "No deadline"}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={onApplyNow}
          className="px-6 py-2 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 cursor-pointer"
        >
          Apply Now
        </button>
        <button className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100">
          Save
        </button>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">
          Description and Requirement
        </h3>
        <p className="text-gray-600 leading-relaxed">{job.description || "No description available"}</p>
      </div>
    </>
  );
}
