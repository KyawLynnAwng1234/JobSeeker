// EducationModal.js
import React from "react";

export default function CertificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mt-10 p-6 animate-slideDown">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Certification</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Certification Name */}
          <div>
            <label className="block font-medium mb-1">
              Certification Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Your Certification Name"
            />
          </div>

          {/* Organsltion(optional) */}
          <div>
            <label className="block font-medium mb-1">Organsltion(optional)</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Your Organsltion"
            />
          </div>

          {/* Start / End Date */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Expiration date check box */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completion"
              className="w-4 h-4 border rounded"
            />
            <label htmlFor="completion" className="text-gray-700">
              I don't have an expiration date
            </label>
          </div>

          {/* Course highlight */}
          <div>
            <label className="block font-medium mb-1">Description (Optional)    </label>
            <textarea
              rows="4"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Description"
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
