// src/components/jobs/JobForm.jsx
import React, { useEffect, useState } from "react";
import { createJob, updateJob, getJobDetail } from "../../../utils/api/jobAPI";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function JobForm({ jobId }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    job_type: "",
    location: "",
    salary: "",
    deadline: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  // Edit mode → load old data
  useEffect(() => {
    if (jobId) {
      getJobDetail(jobId).then((res) => {
        const data = res.data;
        setFormData({
          ...data,
          category: data.category, // UUID
        });
      });
    }
  }, [jobId]);

  // ✅ fetch categories
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/job/job-categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (jobId) {
        await updateJob(jobId, formData);
        toast.success("✅ Job updated successfully!");
        navigate("/employer/dashboard/my-jobs");
      } else {
        await createJob(formData);
        toast.success("✅ Job created successfully!");
        navigate("/employer/dashboard/my-jobs");
        setFormData({
          title: "",
          job_type: "",
          location: "",
          salary: "",
          deadline: "",
          description: "",
          category: "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error saving job");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Field Config
  const fields = [
    { name: "title", label: "Job Title", type: "text" },
    { name: "job_type", label: "Job Type", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "salary", label: "Salary Range", type: "number" },
    { name: "deadline", label: "Deadline", type: "date" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {jobId ? "Edit Job" : "Create Job"}
      </h2>

      {/* loop basic fields */}
      {fields.map((field) => (
        <div className="mb-4" key={field.name}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm h-10"
          />
        </div>
      ))}

      {/* Category Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm h-10"
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <textarea
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md"
      >
        {loading ? "Saving..." : jobId ? "Update Job" : "Create Job"}
      </button>
    </form>
  );
}
