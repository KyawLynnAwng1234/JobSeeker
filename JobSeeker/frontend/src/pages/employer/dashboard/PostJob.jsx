// src/components/PostJob.jsx
import React, { useState, useContext } from "react";
import { createJob } from "../../../utils/api/jobAPI";
import { EmployerAuthContext } from "../../../context/EmployerAuthContext";

export default function PostJob({ onBack }) {
  const { employer } = useContext(EmployerAuthContext);
  const [formData, setFormData] = useState({
    title: "",
    function: "",
    location: "",
    salary: "",
    postDate: "",
    description: "",
  });

  // input fields configuration
  const fields = [
    { name: "title", label: "Job Title", type: "text", full: true },
    { name: "function", label: "Job Function", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "salary", label: "Salary Range", type: "text" },
    { name: "postDate", label: "Post Date", type: "date" },
  ];

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employer) return alert("Please login to post a job!");

    try {
      const res = await createJob(formData);
      console.log("✅ Job created:", res.data);
      onBack();
    } catch (err) {
      console.error("❌ Error creating job:", err);
      alert("Failed to create job.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Post your Job</h1>
        <button
          type="button"
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Back to My Jobs
        </button>
      </div>

      {/* grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* loop fields */}
        {fields.map((field) => (
          <div key={field.name} className={field.full ? "col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10"
            />
          </div>
        ))}

        {/* Job Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            rows="5"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Description"
          ></textarea>
        </div>

        <div className="flex justify-end col-span-1 md:col-span-2 mt-4">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md"
          >
            Post a Job
          </button>
        </div>
      </div>
    </form>
  );
}
