// EducationModal.js
import React from "react";

export default function EducationModal({ isOpen, onClose }) {
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
        <form className="space-y-5">
          {/* Educational qualifications */}
          <div>
            <label className="block font-medium mb-1">Educational qualifications</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Write your educational qualifications."
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block font-medium mb-1">Institution</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Write your institution."
            />
          </div>

          {/* Qualification completion */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completion"
              className="w-4 h-4 border rounded"
            />
            <label htmlFor="completion" className="text-gray-700">
              Qualification completion
            </label>
          </div>

          {/* Finished year */}
          <div>
            <label className="block font-medium mb-1">Finished</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300">
              <option>Select Year</option>
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

          {/* Course highlight */}
          <div>
            <label className="block font-medium mb-1">Course highlight</label>
            <textarea
              rows="4"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
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
