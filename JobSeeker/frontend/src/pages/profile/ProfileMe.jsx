import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiMail, CiPhone, CiGlobe } from "react-icons/ci";
import { FaLocationDot, FaLinkedin, FaGithub } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EditSummaryModal from "./editprofile/EditSummaryModal";
import EducationModal from "./editprofile/EducationModal";
import CertificationModal from "./editprofile/CertificationModal";

export default function ProfileMe() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    full_name: "",
    address: "",
    phone: "",
    bio: "",
    profile_picture: "",
    website: "",
    linkedin: "",
    github: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isCertificationOpen, setIsCertificationOpen] = useState(false);

  const sections = [
    { title: "Education", desc: "Tell us about your education level", btn: "Education", onClick: () => setIsEducationOpen(true) },
    { title: "Certifications", btn: "Certifications", onClick: () => setIsCertificationOpen(true) },
    { title: "Skills", btn: "Your Skills" },
    { title: "Language", btn: "Proficient language" },
  ];

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/sign-in", { replace: true });
    } else {
      axios.get(`${import.meta.env.VITE_API_URL}/profile/`, { withCredentials: true })
        .then((res) => setProfile(res.data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user, loading, navigate]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002366] to-[#003AB3] text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
              src={profile.profile_picture || "/default-avatar.png"}
              alt={profile.full_name || "Profile Picture"}
              className="w-32 h-32 rounded-full object-cover border-4 border-white"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{profile.full_name || "Full Name"}</h1>
            {profile.bio && <p className="mb-4 text-[#ffffffcf]">{profile.bio}</p>}

            <div className="flex flex-col space-y-2 mb-4 text-[#ffffffcf]">
              {profile.address && (
                <div className="flex items-center space-x-2">
                  <FaLocationDot />
                  <span>{profile.address}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center space-x-2">
                  <CiPhone />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center space-x-2">
                  <CiGlobe />
                  <span>{profile.website}</span>
                </div>
              )}
              {profile.linkedin && (
                <div className="flex items-center space-x-2">
                  <FaLinkedin />
                  <span>{profile.linkedin}</span>
                </div>
              )}
              {profile.github && (
                <div className="flex items-center space-x-2">
                  <FaGithub />
                  <span>{profile.github}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/profile/me/edit")}
              className="border border-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Summary (Job Purpose)</label>
            <div className="relative" onClick={() => setIsModalOpen(true)}>
              <input
                type="text"
                placeholder="Write your job purpose..."
                className="w-full border border-[#0D74CE] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                readOnly
              />
              <span className="absolute right-3 top-2 text-gray-500">✎</span>
            </div>
          </div>

          {sections.map((item, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              {item.desc && <p className="text-sm text-gray-500 mb-2">{item.desc}</p>}
              <button
                className="border border-[#0D74CE] text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                onClick={item.onClick}
              >
                {item.btn}
              </button>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/3 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Resume</h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Upload your resume and cover letter.</p>
              <button className="border border-blue-400 text-blue-600 p-1.5 rounded-lg hover:bg-blue-50">Add Resume</button>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Create your resume for the job.</p>
              <button className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700">Create Resume</button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <EditSummaryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EducationModal isOpen={isEducationOpen} onClose={() => setIsEducationOpen(false)} />
      <CertificationModal isOpen={isCertificationOpen} onClose={() => setIsCertificationOpen(false)} />
    </div>
  );
}
