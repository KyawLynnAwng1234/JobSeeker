import React from "react";
import { MapPin, Briefcase, DollarSign, CalendarDays } from "lucide-react";

const handleApplyNow = () => {
  navigate("/sign-in");
};

function JobSearchDetail() {
  return (
    <div className="container mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-3 p-4 h-[800px] overflow-auto">
        <div className="flex flex-col items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Project Management</h2>
            <p className="text-gray-600">Leadership & Interpersonal Skills</p>
          </div>
          <div className="mt-4 space-y-2 text-gray-600 text-sm">
            <p className="flex items-center gap-2">
              <MapPin size={16} /> Mraku U, Rakhine
            </p>
            <p className="flex items-center gap-2">
              <Briefcase size={16} /> Programme & Project Management
            </p>
            <p className="flex items-center gap-2">
              <DollarSign size={16} /> $50-60 per month
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={16} /> 2d ago
            </p>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleApplyNow}
              className="px-6 py-2 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 cursor-pointer"
            >
              Apply Now
            </button>
            <button className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100">
              Save
            </button>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">
              Description and Requirement
            </h3>
            <p className="text-gray-600 leading-relaxed">
              As a Project Manager, you are responsible for coordinating
              cross-functional teams to deliver projects on time and within
              scope. Key duties include client communication, project
              documentation, risk and issue management, change request handling,
              and team support. Strong organizational, problem-solving, and
              stakeholder management skills are essential for successful
              delivery and maintaining client relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSearchDetail;
