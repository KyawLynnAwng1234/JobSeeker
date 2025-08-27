import { Save, ChevronDown } from "lucide-react";

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.category}</p>
      <p className="text-sm text-gray-600">{job.company}</p>
      <ul className="text-sm mt-2 list-disc list-inside text-gray-600">
        <li>Increased Productivity and Efficiency</li>
        <li>Better Work-Life Balance</li>
        <li>Reduced Procrastination</li>
      </ul>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 mt-2">{job.postedAgo}</p>
        <div className="flex items-center justify-between gap-3">
          <ChevronDown className="text-gray-500 cursor-pointer" />
          <Save className="text-blue-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
