import React, { useState } from "react";
import axios from "axios";

export default function EducationModal({
  isOpen,
  onClose,
  profileId,
  profileName,
}) {
  const [formData, setFormData] = useState({
    school_name: "",
    degree: "",
    field_of_study: "",
    start_year: "",
    end_year: "",
    gpa: "",
    description: "",
    location: "",
    is_current: false,
  });

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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrftoken = getCookie("csrftoken");

    if (!profileId) {
      alert("❌ Profile not found. Cannot save education.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts-jobseeker/education/",
        { ...formData, profile: profileId },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("✅ Education saved successfully!");
        onClose();
      }
    } catch (error) {
      console.error(
        "❌ Failed to save education:",
        error.response?.data || error
      );
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mt-14 max-h-[90vh] overflow-y-auto animate-slideDown p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Education</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">
            ✕
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Profile Name */}
          <div>
            <label className="block font-medium mb-1">Profile</label>
            <input
              type="text"
              value={profileName || "No Profile Name"}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
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

          {/* GPA */}
          <div>
            <label className="block font-medium mb-1">GPA</label>
            <input
              type="number"
              step="0.01"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g. 3.75"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Optional"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="City, Country"
            />
          </div>

          {/* Is Current */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_current"
              checked={formData.is_current}
              onChange={handleChange}
            />
            <label>Currently Studying</label>
          </div>

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
