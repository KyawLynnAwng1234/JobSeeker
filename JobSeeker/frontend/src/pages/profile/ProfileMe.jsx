import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiMail } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EditSummaryModal from "./editprofile/EditSummaryModal";
import EducationModal from "./editprofile/EducationModal"; // ✅ Education Modal import
import CertificationModal from "./editprofile/CertificationModal";

export default function ProfileMe() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", location: "", email: "" });
  const [isModalOpen, setIsModalOpen] = useState(false); // Summary modal
  const [isEducationOpen, setIsEducationOpen] = useState(false); // ✅ Education modal
  const [isCertificationOpen, setIsCertificationOpen] = useState(false); // ✅ Certification modal

  const sections = [
    {
      title: "Education",
      desc: "Tell us about your education level",
      btn: "Education",
      onClick: () => setIsEducationOpen(true), // ✅ open education modal
    },
    {
      title: "Certifications",
      btn: "Certifications",
      onClick: () => setIsCertificationOpen(true),
    },
    { title: "Skills", btn: "Your Skills" },
    { title: "Language", btn: "Proficient language" },
  ];

  // ✅ Login check
  useEffect(() => {
    if (!user) {
      navigate("/sign-in", { replace: true });
    } else {
    axios
      .get(`${import.meta.env.VITE_API_URL}/profile/`, {
        withCredentials: true,
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user, navigate]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002366] to-[#003AB3] text-white py-8">
        <div className="container mx-auto px-4 h-[300px]">
          <div className="flex flex-col w-full h-full justify-center items-start">
            <h1 className="text-3xl font-bold mb-2 text-[#ffffffcf]">
              {profile.name || "Profile Name"}
            </h1>
            <div className="flex justify-center items-center space-x-2 py-1">
              <FaLocationDot />
              <p className="text-[#ffffffcf]">
                {profile.location || "Location"}
              </p>
            </div>
            <div className="flex justify-center items-center space-x-2 py-1">
              <CiMail />
              <p className="text-[#ffffffcf]">
                {profile.email || "user@gmail.com"}
              </p>
            </div>
            <button className="border rounded-xl p-1.5 my-4 text-[#ffffffcf]">
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-6 py-6">
          {/* Left Section */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2">
                Summary (Job Purpose)
              </label>
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

            {sections.map((item, index) => (
              <div key={index}>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                {item.desc && (
                  <p className="text-sm text-gray-500 mb-2">{item.desc}</p>
                )}
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
            <div className="flex flex-col gap-4 justify-start items-start">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your resume and cover letter.
                </p>
                <button className="border border-blue-400 text-blue-600 p-1.5 rounded-lg mb-4 hover:bg-blue-50">
                  Add Resume
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Create your resume for the job.
                </p>
                <button className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700">
                  Create Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Modal here */}
      <EditSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EducationModal
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
      />
      <CertificationModal
        isOpen={isCertificationOpen}
        onClose={() => setIsCertificationOpen(false)}
      />
    </div>
  );
}
