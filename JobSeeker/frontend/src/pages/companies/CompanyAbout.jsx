import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CompanyAbout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/accounts-employer/job/company/${id}/`
        );
        console.log("Respoin API:", res.data);
        setCompany(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company detail:", error);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading company details...</div>;
  }

  if (!company) {
    return <div className="text-center py-20">Company not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <section className="">
        <img
          src={
            company.cover
              ? `http://127.0.0.1:8000${company.cover}`
              : "/banner-default.jpg"
          }
          alt="banner"
          className="w-full h-[360px] object-cover"
        />
        <div className="container mx-auto px-4 relative">
          <div className="absolute left-0 bottom-10 rounded-lg flex items-center space-x-4">
            <img
              src={
                company.logo
                  ? `http://127.0.0.1:8000${company.logo}`
                  : "/logo.png"
              }
              alt="company-logo"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-[#ffffffcf]">
                {company.business_name}
              </h2>
              <p className="text-[#ffffffcf]">
                {company.city || "No city info"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          About {company.business_name}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {company.description || "No description provided"}
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
          <li>Industry: {company.industry || "Unknown"}</li>
          <li>Founded Year: {company.founded_year || "N/A"}</li>
          <li>Company Size: {company.size || "N/A"}</li>
          <li>Website: {company.website || "N/A"}</li>
          <li>Contact: {company.contact_email || "N/A"}</li>
        </ul>
      </section>

      {/* Available Jobs */}
      <section className="container mx-auto p-4">
        <h3 className="text-xl font-semibold mb-4">
          Available Jobs (
          {company.jobs_in_com_s ? company.jobs_in_com_s.length : 0})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {company.jobs_in_com_s && company.jobs_in_com_s.length > 0 ? (
            company.jobs_in_com_s.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <h4 className="font-semibold">{job.title}</h4>
                <p className="text-gray-600">{job.location}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No jobs available</p>
          )}
        </div>
      </section>

      <div className="container mx-auto p-4">
        <button
          onClick={() => navigate("/companies")}
          className="mt-4 border border-gray-400 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          ← Back to Companies
        </button>
      </div>
    </div>
  );
}
