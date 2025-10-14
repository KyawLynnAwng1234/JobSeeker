import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiMail, CiPhone, CiGlobe } from "react-icons/ci";
import { FaLocationDot, FaLinkedin, FaGithub } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EditSummaryModal from "./editprofile/EditSummaryModal";
import EducationModal from "./editprofile/EducationModal";
import ExperienceModal from "./editprofile/ExperienceModal";
import SkillModal from "./editprofile/SkillModal";
import LanguageModal from "./editprofile/LanguageModal";
<<<<<<< HEAD
import ResumeModal from "./editprofile/ResumeModal";
=======
>>>>>>> 1a85d44ec57cf4f66837744eb5e00f6e92626933

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
    email: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
<<<<<<< HEAD
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
=======
>>>>>>> 1a85d44ec57cf4f66837744eb5e00f6e92626933

  const sections = [
    {
      title: "Education",
      desc: "Tell us about your education level",
      btn: "Education",
      onClick: () => setIsEducationOpen(true),
    },
    {
      title: "Experiences",
      desc: "Add your professional Experiences",
      btn: "Experiences",
      onClick: () => setIsExperienceModalOpen(true),
    },
    {
      title: "Skills",
      desc: "List your skills to impress employers",
      btn: "Your Skills",
      onClick: () => setIsSkillModalOpen(true),
    },
    {
      title: "Languages",
      desc: "Show languages you’re proficient in",
      btn: "Proficient Languages",
      onClick: () => setIsLanguageModalOpen(true),
    },
  ];

  // ✅ Fetch Profile Data
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/sign-in", { replace: true });
    } else {
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/accounts-jobseeker/jobseekerprofile/`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const profileData =
            Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : {};
          setProfile({
            ...profileData,
            // ✅ login user email
            email: user.email || "",
          });
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🌟 Hero Section */}
      <section className="relative bg-gradient-to-r from-[#002366] to-[#003AB3] text-white py-10 rounded-b-2xl shadow-lg overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center h-[300px]">
          {/* Profile Picture */}
          <div className="flex justify-center md:justify-start">
            <img
              src={
                profile.profile_picture
                  ? `${import.meta.env.VITE_API_URL}${profile.profile_picture}`
                  : "/default-avatar.png"
              }
              alt={profile.full_name || "Profile Picture"}
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>

          {/* Profile Info */}
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              {profile.full_name || "Full Name"}
            </h1>
            <p className="text-[#ffffffcc]">
              {profile.bio || "Write something about yourself..."}
            </p>

            {/* Address, Phone & Email */}
            <div className="flex flex-col items-center md:items-start gap-1 text-[#ffffffb0]">
              <div className="flex items-center gap-2">
                <FaLocationDot />
                <span>{profile.address || "Your Address"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CiPhone />
                <span>{profile.phone || "Your Phone"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CiMail />
                <span>{profile.email || "Your Email"}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start gap-2 text-[#ffffffb0] w-full overflow-hidden break-words">
            <div className="flex items-start gap-2 w-full break-all">
              <CiGlobe className="flex-shrink-0 mt-1" />
              <a
                href={profile.website || "#"}
                target="_blank"
                rel="noreferrer"
                className="hover:underline break-words whitespace-normal overflow-hidden text-ellipsis w-full"
              >
                {profile.website || "Website"}
              </a>
            </div>

            <div className="flex items-start gap-2 w-full break-all">
              <FaLinkedin className="flex-shrink-0 mt-1" />
              <a
                href={profile.linkedin || "#"}
                target="_blank"
                rel="noreferrer"
                className="hover:underline break-words whitespace-normal overflow-hidden text-ellipsis w-full"
              >
                {profile.linkedin || "LinkedIn"}
              </a>
            </div>

            <div className="flex items-start gap-2 w-full break-all">
              <FaGithub className="flex-shrink-0 mt-1" />
              <a
                href={profile.github || "#"}
                target="_blank"
                rel="noreferrer"
                className="hover:underline break-words whitespace-normal overflow-hidden text-ellipsis w-full"
              >
                {profile.github || "GitHub"}
              </a>
            </div>
          </div>
        </div>

        {/* ✏️ Edit Profile Button */}
        <button
          onClick={() => navigate("/profile/me/edit")}
          className="absolute top-8 right-8 bg-white text-blue-700 font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-200 transition"
        >
          ✎
        </button>
      </section>

      {/* 🧩 Features Section */}
      <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1 space-y-8">
          {/* Summary Input */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Summary (Job Purpose)
            </label>
            <div className="relative" onClick={() => setIsModalOpen(true)}>
              <input
                type="text"
                placeholder="Write your job purpose..."
                value={profile.bio || ""}
                className="w-full border border-[#0D74CE] rounded-lg px-4 py-2 bg-white cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
                readOnly
              />
              <span className="absolute right-3 top-2 text-gray-500">✎</span>
            </div>
          </div>

          {/* Other Sections */}
          {sections.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              {item.desc && (
                <p className="text-sm text-gray-500 mb-2">{item.desc}</p>
              )}
              <button
                className="border border-[#0D74CE] text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                onClick={item.onClick}
              >
                {item.btn}
              </button>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/3 bg-blue-50 rounded-lg p-6 shadow-inner">
          <h2 className="text-lg font-semibold mb-3 text-blue-900">Resume</h2>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Upload your resume and cover letter.
              </p>
<<<<<<< HEAD
              <button
                className="border border-blue-400 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                onClick={() => setIsResumeModalOpen(true)}
              >
=======
              <button className="border border-blue-400 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
>>>>>>> 1a85d44ec57cf4f66837744eb5e00f6e92626933
                Add Resume
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Create your resume directly from your profile.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Create Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🪟 Modals */}
      <EditSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EducationModal
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
      />
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
      />
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
      />
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
<<<<<<< HEAD
      />
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
=======
>>>>>>> 1a85d44ec57cf4f66837744eb5e00f6e92626933
      />
    </div>
  );
}
