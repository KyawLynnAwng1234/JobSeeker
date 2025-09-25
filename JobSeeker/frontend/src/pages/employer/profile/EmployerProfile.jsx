import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Mail,
  MapPin,
  Globe,
  Building2,
  Phone,
  Users,
  Calendar,
  AtSign,
} from "lucide-react";

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/accounts-employer/employer/profile/",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": getCSRFToken(),
          },
        }
      );

      const emp = res.data.employer_profile[0];
      setProfile(emp);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("employerUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setEmail(parsedUser.email);
    }

    fetchProfile();
  }, []);

  const handleAvatarClick = () => {
    setShowUploadButton(true);
  };

  // 🔹 Upload button ကိုနှိပ်မှ file picker ဖွင့်မယ်
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // 🔹 File upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("access");
    const formData = new FormData();

    formData.append("logo", file);

    try {
      await axios.patch(
        `http://127.0.0.1:8000/accounts-employer/employer/profile-update/${profile.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": getCSRFToken(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchProfile();
      setShowUploadButton(false); // ✅ upload ပြီးရင် button ပိတ်
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };

  if (!profile) return <p>Loading...</p>;

  const profileFields = [
    {
      label: "Email",
      value: email,
      icon: <Mail className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "City",
      value: profile.city,
      icon: <MapPin className="w-5 h-5 text-red-500" />,
    },
    {
      label: "Website",
      value: profile.website,
      icon: <Globe className="w-5 h-5 text-green-500" />,
    },
    {
      label: "Industry",
      value: profile.industry,
      icon: <Building2 className="w-5 h-5 text-purple-500" />,
    },
    {
      label: "Phone",
      value: profile.phone,
      icon: <Phone className="w-5 h-5 text-teal-500" />,
    },
    {
      label: "Company Size",
      value: profile.size,
      icon: <Users className="w-5 h-5 text-orange-500" />,
    },
    {
      label: "Founded Year",
      value: profile.founded_year,
      icon: <Calendar className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: "Contact Email",
      value: profile.contact_email,
      icon: <AtSign className="w-5 h-5 text-pink-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-sky-50 flex">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">Employee Profile</h1>

        <section className="relative bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold cursor-pointer hover:opacity-80 transition relative"
              style={{
                backgroundColor: profile?.logo ? "transparent" : "#3b82f6",
              }}
              onClick={handleAvatarClick}
            >
              {profile?.logo ? (
                <img
                  src={`http://127.0.0.1:8000${profile.logo}`}
                  alt={profile.first_name || "Avatar"}
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                  }}
                />
              ) : (
                profile?.first_name?.charAt(0).toUpperCase() || "U"
              )}

              {/* 🔹 Upload Button ပေါ်လာမယ် */}
              {showUploadButton && (
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={handleUploadClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                  >
                    📤 Upload
                  </button>
                </div>
              )}
            </div>

            {/* 🔹 Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-base text-gray-500 mt-1">
                Company Name : {profile.business_name ?? "N/A"}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {profileFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    {field.icon}
                    <span className="font-medium">{field.label}:</span>
                    <span className="text-base">{field.value ?? "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-8 h-8" />
          </div>

          <div
            onClick={() =>
              navigate("/employer/dashboard/profile/edit", {
                state: {
                  profile: {
                    ...profile, // old profile data
                    id: profile.id, // ✅ id ထည့်
                  },
                },
              })
            }
            className="absolute top-0 right-0 p-6 text-3xl font-bold cursor-pointer"
          >
            <Edit size={28} />
          </div>
        </section>
      </main>
    </div>
  );
}
