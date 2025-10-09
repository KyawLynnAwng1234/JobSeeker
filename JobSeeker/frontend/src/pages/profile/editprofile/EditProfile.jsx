import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

export default function EditProfile({ initialProfile, apiUrl = "http://127.0.0.1:8000/accounts-jobseeker/jobseekerprofile/", onSave }) {
  const { user, token } = useAuth(); // current logged-in user
  const [profile, setProfile] = useState({
    email: user?.email || "",  // ✅ email auto-fill
    full_name: "",
    phone: "",
    address: "",
    bio: "",
    profile_picture: null,
    website: "",
    linkedin: "",
    github: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // update state when initialProfile loads
  useEffect(() => {
    if (initialProfile && user) {
      setProfile((prev) => ({
        ...prev,
        full_name: initialProfile.full_name || "",
        phone: initialProfile.phone || "",
        address: initialProfile.address || "",
        bio: initialProfile.bio || "",
        website: initialProfile.website || "",
        linkedin: initialProfile.linkedin || "",
        github: initialProfile.github || "",
      }));
    }
  }, [initialProfile, user]);

  // handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfile({ ...profile, [name]: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!initialProfile?.id) {
      setError("Profile ID not found. Cannot update.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    for (const key in profile) {
      if (profile[key] !== null) formData.append(key, profile[key]);
    }

    try {
      const response = await axios.put(
        `${apiUrl}${initialProfile.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (onSave) onSave(response.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // render loading if user or profile not ready
  if (!user) return <p>Loading user...</p>;
  if (!initialProfile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      {error && <p className="text-red-500 mb-4">{JSON.stringify(error)}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-semibold">Address</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 font-semibold">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows="4"
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block mb-1 font-semibold">Profile Picture</label>
          <input
            type="file"
            name="profile_picture"
            onChange={handleChange}
            className="w-full"
            accept="image/*"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block mb-1 font-semibold">Website</label>
          <input
            type="url"
            name="website"
            value={profile.website}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block mb-1 font-semibold">LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={profile.linkedin}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Github */}
        <div>
          <label className="block mb-1 font-semibold">Github</label>
          <input
            type="url"
            name="github"
            value={profile.github}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
