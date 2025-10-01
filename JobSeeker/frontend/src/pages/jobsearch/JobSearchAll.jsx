import React from "react";
import { FaBookmark } from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import EnterSearch from "../EnterSearch";
import QuickSearchSection from "../homepage/QuickSearchSection";

const jobs = [
  {
    title: "Project Manager",
    company: "Time Management",
    location: "Mirpur, U",
    duties: [
      "Increase Productivity and Efficiency",
      "Best Work Balance",
      "Reduce Process return",
    ],
    time: "1h ago",
  },
  {
    title: "Project Manager",
    company: "Time Management",
    location: "Mirpur, U",
    duties: [
      "Increased Productivity and Efficiency",
      "Best Work Balance",
      "Reduce Process return",
    ],
    time: "2h ago",
  },
  {
    title: "Project Manager",
    company: "Time Management",
    location: "Mirpur, U",
    duties: [
      "Increased Productivity and Efficiency",
      "Best Work Balance",
      "Reduce Process return",
    ],
    time: "2d ago",
  },
  {
    title: "Project Manager",
    company: "Time Management",
    location: "Mirpur, U",
    duties: [
      "Increased Productivity and Efficiency",
      "Best Work Balance",
      "Reduce Process return",
    ],
    time: "2d ago",
  },
  {
    title: "Project Manager",
    company: "Time Management",
    location: "Mirpur, U",
    duties: [
      "Increased Productivity and Efficiency",
      "Best Work Balance",
      "Reduce Process return",
    ],
    time: "3d ago",
  },
  {
    title: "Project Manager",
    company: "Time Management",
    location: "Mirpur, U",
    duties: [
      "Increased Productivity and Efficiency",
      "Best Work Balance",
      "Reduce Process return",
    ],
    time: "4d ago",
  },
  {
    title: "Project Manager",
    company: "Time Management",
    location: "Mirpur, U",
    duties: [
      "Increased Productivity and Efficiency",
      "Best Work Balance",
      "Reduce Process return",
    ],
    time: "5d ago",
  },
  {
    title: "Project Manager",
    company: "Time Management",
    location: "Mirpur, U",
    duties: [
      "Increased Productivity and Efficiency",
      "Best Work Balance",
      "Reduce Process return",
    ],
    time: "6d ago",
  },
];

const JobCard = ({ job }) => (
  <div className="border border-gray-300 rounded-lg p-4 relative shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="absolute top-4 right-4 text-blue-500">
      <FaBookmark size={20} />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
    <p className="text-sm text-gray-600">{job.company}</p>
    <p className="text-sm text-gray-500 mt-1">{job.location}</p>
    <ul className="list-disc list-inside mt-3 text-sm text-gray-700">
      {job.duties.map((duty, index) => (
        <li key={index}>{duty}</li>
      ))}
    </ul>
    <p className="text-sm text-gray-400 mt-4">{job.time}</p>
  </div>
);

const JobSearchAll = () => (
  <div>

    <EnterSearch />

    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Jobs you can apply for as you wish
        </h2>
        <div className="flex space-x-2">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">
            180 Jobs
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
            New
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <button className="p-2 rounded-md hover:bg-gray-200">
            <HiOutlineChevronLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex space-x-1">
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold">
              1
            </button>
            <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200">
              2
            </button>
            <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200">
              3
            </button>
            <span className="px-4 py-2 text-gray-500">...</span>
            <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200">
              10
            </button>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-200">
            <HiOutlineChevronRight size={20} className="text-gray-600" />
          </button>
        </nav>
      </div>
    </div>

    <QuickSearchSection />
  </div>
);

export default JobSearchAll;
