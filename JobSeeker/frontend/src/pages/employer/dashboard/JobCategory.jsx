// src/components/PostJob.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function JobCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ message ကို 3s အပြီး auto clear
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      setMessage({ type: "error", text: "Please enter category name" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // CSRF token အရင်ရွာပြီး
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = await axios.post(
        "http://127.0.0.1:8000/job/job-categories/create/", // backend endpoint ကို adjust လုပ်ပါ
        { name: categoryName },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true, // Django session cookie ကိုထည့်ရန်
        }
      );

      setMessage({ type: "success", text: "✅ Category added successfully!" });
      setCategoryName(""); // input ကို reset
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "❌ Error adding category" });
      alert("Error adding category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Category</h1>
      </div>

      {/* ✅ Success / Error message box */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* grid layout */}
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="categoryname"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
}
