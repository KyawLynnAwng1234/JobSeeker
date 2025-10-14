import React, { useState } from "react";
import axios from "axios";

export default function ResumeModal({
  isOpen,
  onClose,
  profileId,
  profileName,
}) {
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    data: "",
    is_default: false,
  });

  // ✅ Get CSRF Token
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

  // ✅ Form Input Change Handler
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrftoken = getCookie("csrftoken");
    const token = localStorage.getItem("access");

    if (!profileId) {
      alert("❌ Profile not found. Cannot save resume.");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("profile", profileId);
    dataToSend.append("title", formData.title);
    dataToSend.append("file", formData.file);

    // ✅ JSONField → stringify before sending
    if (formData.data) {
      try {
        // Try to parse user input as JSON (or fallback to text)
        const jsonParsed = JSON.parse(formData.data);
        dataToSend.append("data", JSON.stringify(jsonParsed));
      } catch {
        // If not valid JSON, wrap it as string
        dataToSend.append("data", JSON.stringify({ text: formData.data }));
      }
    }

    dataToSend.append("is_default", formData.is_default);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/accounts-jobseeker/resume/",
        dataToSend,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );

      console.log("✅ Resume saved:", res.data);
      alert("✅ Resume uploaded successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Failed to save resume:", error.response?.data || error);
      alert(
        "❌ Failed to save resume:\n" +
          JSON.stringify(error.response?.data, null, 2)
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mt-14 max-h-[90vh] overflow-y-auto animate-slideDown p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">Add Resume</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">
            ✕
          </button>
        </div>

        {/* Form */}
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

          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g. My Resume - 2025"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block font-medium mb-1">
              File (PDF / DOC / Image)
            </label>
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Data (Optional Note) */}
          <div>
            <label className="block font-medium mb-1">Notes (Optional)</label>
            <textarea
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Add notes or description about your resume..."
              rows={3}
            />
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600"
            />
            <label>Set as Default Resume</label>
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
              className="bg-blue-100 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-200 transition"
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
