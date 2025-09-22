import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CompaniesImg from "../../assets/images/companies.jpg";
import CompaniesImgTwo from "../../assets/images/logotwo.png";

const dummyJobs = [
  { id: 1, title: "Career Growth and Development", company: "Mrauk U" },
  { id: 2, title: "Marketing Specialist", company: "Globle" },
  { id: 3, title: "Product Manager", company: "Mrauk U" },
  { id: 4, title: "Sales Associate", company: "Globle" },
  { id: 5, title: "Sales Marketing", company: "PaukTaw" },
];

export default function CompanyAbout() {
  const navigate = useNavigate();
  const location = useLocation();

  const showAvailable = location.pathname === "/companies/about/available-jobs";

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <section className="">
        <img
          src={CompaniesImg}
          alt="banner"
          className="w-full h-[360px] object-cover"
        />
        <div className="container mx-auto px-4 relative">
          <div className="absolute left-0 bottom-10 rounded-lg flex items-center space-x-4">
            <img
              src={CompaniesImgTwo}
              alt="company-logo"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-[#ffffffcf]">Globle</h2>
              <p className="text-[#ffffffcf]">Mrauk U, Rakhine</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">About Globle Company</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          "Global companies" refers to multinational corporations (MNCs) that
          operate and have a significant presence in multiple countries...
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
          <li>International Operations</li>
          <li>Global Brand Recognition</li>
          <li>Diverse Workforce</li>
          <li>Significant Revenue and Market Capitalization</li>
          <li>Influence on global economies</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">
          Examples of Leading Global Companies
        </h3>
        <ol className="list-decimal ml-6 text-gray-700 space-y-1 mb-6">
          <li>Walmart (United States)</li>
          <li>Amazon (United States)</li>
          <li>State Grid Corporation of China</li>
          <li>Saudi Aramco</li>
          <li>China Petrochemical Corporation</li>
        </ol>
      </section>

      {/* Related Jobs / Available Jobs */}
      <section className="container mx-auto p-4">
        {!showAvailable ? (
          <>
            <h3 className="text-xl font-semibold mb-2">Related Jobs</h3>
            <button
              onClick={() => navigate("/companies/about/available-jobs")}
              className="border border-blue-400 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              5 Jobs →
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4">Available Jobs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {dummyJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                >
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/companies/about")}
              className="mt-4 border border-gray-400 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              ← Back
            </button>
          </>
        )}
      </section>
    </div>
  );
}
