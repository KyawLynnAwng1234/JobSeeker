import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const getCSRFToken = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  return cookieValue;
};

export default function EmployerProfileEditPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // EmployerProfilePage ကနေ state ဖြင့် profile လာတာ
  const { profile } = location.state || {};

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    business_name: profile?.business_name || "",
    city: profile?.city || "",
    website: profile?.website || "",
    industry: profile?.industry || "",
    phone: profile?.phone || "",
    size: profile?.size || "",
    founded_year: profile?.founded_year || "",
    contact_email: profile?.contact_email || "",
    logo: null, // file upload
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile?.id) {
      console.error("Profile ID not found!");
      return;
    }

    const token = localStorage.getItem("access");
    const csrfToken = getCSRFToken();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/accounts-employer/employer/profile-update/${profile.id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      console.log("Update response:", res.data);
      navigate("/employer/dashboard/profile");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl"
      >
        <h2 className="text-xl font-semibold mb-6">Edit Employer Profile</h2>

        {/* Logo preview */}
        {profile?.logo && (
          <img
            src={
              profile.logo.startsWith("http")
                ? profile.logo
                : `http://127.0.0.1:8000${profile.logo}`
            }
            alt="Company Logo"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}

        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded mb-4"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            placeholder="Company Name"
            className="border p-2 rounded col-span-2"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Industry"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="Company Size"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="founded_year"
            value={formData.founded_year}
            onChange={handleChange}
            placeholder="Founded Year"
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="Contact Email"
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="mt-6 bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
