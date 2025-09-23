import { useState } from "react";
import axios from "axios";

export default function EmployerAddForm({ profileId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    phone: "",
    website: "",
    industry: "",
    size: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/accounts-employer/employer/profile-update/${profileId}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 👉 CSRF / Cookie session သုံးရင်လိုမယ်
        }
      );

      if (onSuccess) {
        onSuccess(response.data); // parent ကို updated data ပြန်ပေးမယ်
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold mb-4">Update Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="size"
          placeholder="Company Size"
          value={formData.size}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
