import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Users,
  Briefcase,
} from "lucide-react";

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
        const companyData = res.data.company_s[0];
        const jobsData = res.data.jobs_in_com_s;
        setCompany({
          ...companyData,
          jobs_in_com_s: jobsData,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company detail:", error);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading company details...</div>;
  }

  if (!company) {
    return <div className="text-center py-20 text-lg">Company not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white text-center relative">
        <img
          src={
            company.logo
              ? `http://127.0.0.1:8000${company.logo}`
              : "/logo.png"
          }
          alt="company-logo"
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
        />
        <h1 className="text-4xl font-bold">{company.business_name}</h1>
        <p className="text-lg mt-2 flex justify-center items-center gap-2">
          <MapPin className="w-5 h-5" /> {company.city}
        </p>
      </div>

      {/* Company Info Section */}
      <section className="container mx-auto max-w-4xl bg-white shadow-md rounded-xl p-8 mt-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" /> Company Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5 text-gray-700">
          <div className="flex items-center gap-3">
            <User className="text-blue-500" /> <span>Name:</span>{" "}
            <strong>{company.first_name} {company.last_name}</strong>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="text-blue-500" /> <span>Industry:</span>{" "}
            <strong>{company.industry}</strong>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-500" /> <span>Founded:</span>{" "}
            <strong>{company.founded_year}</strong>
          </div>
          <div className="flex items-center gap-3">
            <Users className="text-blue-500" /> <span>Company Size:</span>{" "}
            <strong>{company.size} employees</strong>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-blue-500" /> <span>City:</span>{" "}
            <strong>{company.city}</strong>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-blue-500" /> <span>Phone:</span>{" "}
            <strong>{company.phone}</strong>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="text-blue-500" /> <span>Website:</span>{" "}
            <a
              href={company.website}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {company.website}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-blue-500" /> <span>Email:</span>{" "}
            <strong>{company.contact_email}</strong>
          </div>
        </div>
      </section>

      {/* Available Jobs */}
      <section className="container mx-auto max-w-5xl mt-14 mb-20">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" /> Available Jobs (
          {company.jobs_in_com_s ? company.jobs_in_com_s.length : 0})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {company.jobs_in_com_s && company.jobs_in_com_s.length > 0 ? (
            company.jobs_in_com_s.map((job) => (
              <div
                key={job.id}
                className="border bg-white rounded-xl p-5 shadow hover:shadow-xl transition cursor-pointer"
              >
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  {job.title}
                </h4>
                <p className="text-gray-600 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" /> {job.location}
                </p>
                <p className="text-gray-600 mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" /> {job.job_type}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  💰 Salary: {job.salary}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Deadline: {job.deadline}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No jobs available</p>
          )}
        </div>
      </section>

      <div className="container mx-auto max-w-5xl mb-10">
        <button
          onClick={() => navigate("/companies")}
          className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          ← Back to Companies
        </button>
      </div>
    </div>
  );
}
