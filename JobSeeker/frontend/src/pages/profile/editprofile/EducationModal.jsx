// EducationModal.js
import React, { useState } from "react";
import axios from "axios";

export default function EducationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    profile: "",
    school_name: "",
    degree: "",
    field_of_study: "",
    start_year: "",
    end_year: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Token ကို localStorage ထဲကယူပါ
    const token = localStorage.getItem("access");
    console.log("Access token:", token);

    if (!token) {
      alert("❌ You must login first before adding education.");
      return;
    }

    console.log("Access token:", token);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts-jobseeker/education/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("✅ Education saved successfully!");
        onClose();
      }
    } catch (error) {
      console.error("❌ Failed to save education:", error.response?.data || error);
      alert(
        `Failed to save education.\n${
          error.response?.data?.detail || "Check your token or form data."
        }`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mt-10 p-6 animate-slideDown">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Education</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">✕</button>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Profile */}
          <div>
            <label className="block font-medium mb-1">Profile</label>
            <input
              type="text"
              name="profile"
              value={formData.profile}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          {/* School Name */}
          <div>
            <label className="block font-medium mb-1">School Name</label>
            <input
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g. University of Yangon"
              required
            />
          </div>

          {/* Degree */}
          <div>
            <label className="block font-medium mb-1">Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g. Bachelor of Science"
              required
            />
          </div>

          {/* Field of Study */}
          <div>
            <label className="block font-medium mb-1">Field of Study</label>
            <input
              type="text"
              name="field_of_study"
              value={formData.field_of_study}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g. Computer Science"
              required
            />
          </div>

          {/* Start Year */}
          <div>
            <label className="block font-medium mb-1">Start Year</label>
            <select
              name="start_year"
              value={formData.start_year}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Select Start Year</option>
              {Array.from({ length: 30 }, (_, i) => {
                const year = 2025 - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* End Year */}
          <div>
            <label className="block font-medium mb-1">End Year</label>
            <select
              name="end_year"
              value={formData.end_year}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Select End Year</option>
              {Array.from({ length: 30 }, (_, i) => {
                const year = 2025 - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-blue-100 text-blue-600 px-6 py-2 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
