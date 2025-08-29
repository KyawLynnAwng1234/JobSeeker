import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../hooks/useEmployerAuth";

export default function EmployerRegister() {
  const { register } = useEmployerAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("You must accept the Terms & Conditions first!");
      return;
    }

    try {
      await register({ email, password });
      alert("Register success ✅ Now fill company detail.");
      navigate("/employer/company-detail");
    } catch (err) {
      alert("Register failed ❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Logo */}
      <div className="absolute top-6 left-10">
        <h1 className="text-2xl font-bold text-blue-900">Jobseeker</h1>
      </div>

      <div className="bg-blue-50 p-8 rounded-2xl shadow max-w-md w-full text-center">
        <p className="text-sm text-gray-600 mb-2">
          Are you looking for{" "}
          <Link to="/sign-in" className="text-blue-600">
            a job?
          </Link>
        </p>
        <h2 className="text-2xl font-bold mb-6">Register as an Employer</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">
              I accept the{" "}
              <Link to="/terms" className="text-blue-600">
                Terms & Conditions
              </Link>
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have account?{" "}
          <Link to="/employer/sign-in" className="text-blue-600 font-medium">
            Sign In
          </Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © 2023 Copyright: Jobstreet .com
      </footer>
    </div>
  );
}
