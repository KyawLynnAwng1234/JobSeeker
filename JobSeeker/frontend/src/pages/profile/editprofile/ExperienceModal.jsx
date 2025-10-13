import React, { useState } from "react";
import axios from "axios";

export default function ExperienceModal({ isOpen, onClose, profileId, profileName }) {
  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });

  // ✅ CSRF Helper
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

  // ✅ Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrftoken = getCookie("csrftoken");

    if (!profileId) {
      alert("❌ Profile not found. Cannot save experience.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts-jobseeker/experience/",
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
        alert("✅ Experience saved successfully!");
        onClose();
      }
    } catch (error) {
      console.error("❌ Failed to save experience:", error.response?.data || error);
      alert(
        `Failed to save experience.\n${
          error.response?.data?.detail || "Check your token or form data."
        }`
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mt-14 max-h-[90vh] overflow-y-auto animate-slideDown p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Experience</h2>
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

          {/* Job Title */}
          <div>
            <label className="block font-medium mb-1">Job Title</label>
            <input
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block font-medium mb-1">Company Name</label>
            <input
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="e.g. Google"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block font-medium mb-1">Position</label>
            <input
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="e.g. Senior Engineer"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="e.g. Yangon"
            />
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">End Date</label>
              <input
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                disabled={formData.is_current}
              />
            </div>
          </div>

          {/* Currently Working */}
          <div className="flex items-center gap-2">
            <input
              name="is_current"
              type="checkbox"
              checked={formData.is_current}
              onChange={handleChange}
            />
            <label>Currently Working</label>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="Describe your role and responsibilities..."
            ></textarea>
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
