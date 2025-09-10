// src/components/PostJob.jsx
import React, { useState, useContext, useEffect } from "react";
import { createJob } from "../../../utils/api/jobAPI";
import { EmployerAuthContext } from "../../../context/EmployerAuthContext";
import axios from "axios";

export default function PostJob({ onBack }) {
  const { employer } = useContext(EmployerAuthContext);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    job_type: "",
    location: "",
    salary: "",
    postDate: "",
    description: "",
    category: "",
    employer: employer?.id || "your@email.com", // ✅ employer name
  });

  // employer change ဖြစ်ရင် formData update
  useEffect(() => {
    if (employer) {
      setFormData((prev) => ({
        ...prev,
        employer: employer.username || employer.email || "",
      }));
    }
  }, [employer]);

  // ✅ fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/job/job-categories/"
        );
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // input fields config
  const fields = [
    { name: "title", label: "Job Title", type: "text" },
    { name: "job_type", label: "Job Type", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "salary", label: "Salary Range", type: "number" },
    { name: "deadline", label: "Deadline", type: "date" },
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
    console.log("Sending Job Data:", formData);

    try {
      const res = await createJob(formData);
      console.log("✅ Job created:", res.data);
      setMessage({ type: "success", text: "Job created successfully!" });

      // ✅ MyJobs.jsx ကို data ပြန်ပို့မယ်
      if (res.data && typeof onJobCreated === "function") {
        onJobCreated(res.data); // ← ဒီလိုထည့်ရမယ်
      }
      // ✅ auto clear message after 3s
      setTimeout(() => setMessage(null), 3000);

      // form clear
      setFormData({
        title: "",
        job_type: "",
        location: "",
        salary: "",
        deadline: "",
        description: "",
        category: "",
        employer: employer.username || employer.email || "",
      });
    } catch (err) {
      console.error(
        "❌ Error creating job:",
        err.response?.data || err.message
      );
      setTimeout(() => setMessage(null), 3000);
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

      {/* ✅ show message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employer → Full width */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Employer
          </label>
          <input
            type="text"
            name="employer"
            value={formData.employer}
            readOnly
            className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10"
          />
        </div>

        {/* loop fields */}
        {fields.map((field) => (
          <div key={field.name}>
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

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Job Description */}
        <div className="col-span-2">
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
