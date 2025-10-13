import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";

// Helper to get CSRF token from cookies
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

export default function EditProfile({
  apiUrl = "http://127.0.0.1:8000/accounts-jobseeker/jobseekerprofile/",
  onSave,
}) {
  const { user } = useAuth(); // Session auth only needs user
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(apiUrl, { withCredentials: true });
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        } else {
          setProfile({
            email: user.email || "",
            full_name: "",
            phone: "",
            address: "",
            bio: "",
            profile_picture: null,
            website: "",
            linkedin: "",
            github: "",
          });
        }
      } catch (err) {
        console.error("❌ Fetch profile error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, apiUrl]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfile({ ...profile, [name]: files ? files[0] : value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value);
    });

    const csrftoken = getCookie("csrftoken");

    try {
      const url = profile.id ? `${apiUrl}${profile.id}/` : apiUrl;
      const method = profile.id ? axios.put : axios.post;

      const res = await method(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrftoken,
        },
        withCredentials: true, // Important for session auth
      });

      setProfile(res.data);
      onSave?.(res.data);
      toast.success("✅ Profile saved successfully!");
      navigate("/profile/me", { replace: true });
    } catch (err) {
      console.error("❌ Save error:", err);
=======

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
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // UI states
  if (!user) return <p>Loading user info...</p>;
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">{JSON.stringify(error)}</p>;
=======
  // render loading if user or profile not ready
  if (!user) return <p>Loading user...</p>;
  if (!initialProfile) return <p>Loading profile...</p>;
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
<<<<<<< HEAD

=======
      {error && <p className="text-red-500 mb-4">{JSON.stringify(error)}</p>}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
<<<<<<< HEAD
            value={profile.email || user.email || ""}
=======
            value={profile.email}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
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
<<<<<<< HEAD
            value={profile.full_name || ""}
=======
            value={profile.full_name}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
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
<<<<<<< HEAD
            value={profile.phone || ""}
=======
            value={profile.phone}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
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
<<<<<<< HEAD
            value={profile.address || ""}
=======
            value={profile.address}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 font-semibold">Bio</label>
          <textarea
            name="bio"
<<<<<<< HEAD
            value={profile.bio || ""}
=======
            value={profile.bio}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
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
<<<<<<< HEAD
            accept="image/*"
            className="w-full"
=======
            className="w-full"
            accept="image/*"
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
          />
        </div>

        {/* Website */}
        <div>
          <label className="block mb-1 font-semibold">Website</label>
          <input
            type="url"
            name="website"
<<<<<<< HEAD
            value={profile.website || ""}
=======
            value={profile.website}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
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
<<<<<<< HEAD
            value={profile.linkedin || ""}
=======
            value={profile.linkedin}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
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
<<<<<<< HEAD
            value={profile.github || ""}
=======
            value={profile.github}
>>>>>>> 7e3badd25fec1e19969e1a07a042fa140e4e364c
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
