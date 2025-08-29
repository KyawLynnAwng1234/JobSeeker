import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  employerCompanyDetailAPI,
  employerProfileAPI,
} from "../../utils/api/employerAPI";

const EmployerCompanyDetail = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    companyName: "",
    city: "",
  });

  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("employerToken");
    if (token) {
      employerProfileAPI(token)
        .then((data) => {
          if (data?.email) setEmail(data.email);
        })
        .catch((err) => {
          console.error("Failed to load employer profile:", err);
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 👉 Company Detail API ပို့မယ်
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("employerToken");
      if (!token) {
        alert("You need to login again!");
        return;
      }

      const payload = { ...formData, email };
      const res = await employerCompanyDetailAPI(payload, token);

      console.log("Company detail submitted:", res);
      if (res.emailVerified) {
        alert("Company detail submitted successfully!");
        navigate("/employer/dashboard");
      } else {
        alert("Please verify your email before accessing the dashboard.");
      }
    } catch (error) {
      console.error("Error submitting company detail:", error);
      alert("Failed to submit company detail.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-blue-600">
            Jobseeker
          </NavLink>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex justify-center items-center px-4 mt-25">
        <div className="bg-blue-50 rounded-lg py-10 px-8 w-full max-w-xl shadow-md">
          <h2 className="text-center text-xl mb-1">
            Your employer Account Create
          </h2>
          <p className="text-gray-600 mb-4">
            You’re almost done! We need some details about your business to
            verify your account. We won’t share your details with anyone.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <p className="text-gray-500">{email || "Loading..."}</p>
            </div>

            {/* Full name & Gave name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="We need your registered company name to verify your account."
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
            >
              Create New Account
            </button>
          </form>

          {/* Link */}
          <p className="mt-6 text-gray-600">
            Looking for a job?{" "}
            <a href="#" className="text-blue-600 underline">
              Visit Jobseeker Search
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 px-6 py-10 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Jobseeker</h4>
            <ul className="space-y-1">
              <li>Login</li>
              <li>Register</li>
              <li>Jobs Search</li>
              <li>Saved jobs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Employer</h4>
            <ul className="space-y-1">
              <li>Employer Account</li>
              <li>Post a Job</li>
              <li>Product & Prices</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">About My Jobs</h4>
            <ul className="space-y-1">
              <li>Overview</li>
              <li>About Us</li>
              <li>Contact My Jobs</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <ul className="space-y-1">
              <li>Contact us</li>
              <li className="flex gap-3 mt-2">
                <span>🔵</span>
                <span>📱</span>
                <span>📷</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs py-4 border-t">
          © 2023 Copyright: Tailwind.com
        </div>
      </footer>
    </div>
  );
};

export default EmployerCompanyDetail;
