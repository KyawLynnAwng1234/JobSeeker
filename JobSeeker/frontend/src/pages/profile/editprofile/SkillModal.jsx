import React, { useState } from "react";
import axios from "axios";

export default function SkillModal({ isOpen, onClose, profileId, profileName }) {
  const [formData, setFormData] = useState({
    name: "",
    proficiency_level: "",
  });

  // ✅ CSRF Token Helper
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

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrftoken = getCookie("csrftoken");

    if (!profileId) {
      alert("❌ Profile not found. Cannot save skill.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts-jobseeker/skill/",
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
        alert("✅ Skill saved successfully!");
        onClose();
      }
    } catch (error) {
      console.error(
        "❌ Failed to save skill:",
        error.response?.data || error
      );
      alert(
        `Failed to save skill.\n${
          error.response?.data?.detail || "Check your token or form data."
        }`
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mt-14 max-h-[90vh] overflow-y-auto animate-slideDown p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Skill</h2>
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

          {/* Skill Name */}
          <div>
            <label className="block font-medium mb-1">Skill Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g. React.js"
              required
            />
          </div>

          {/* Proficiency Level */}
          <div>
            <label className="block font-medium mb-1">Proficiency Level</label>
            <select
              name="proficiency_level"
              value={formData.proficiency_level}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Select Level</option>
              <option value={1}>Beginner</option>
              <option value={2}>Intermediate</option>
              <option value={3}>Advanced</option>
              <option value={4}>Expert</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
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
