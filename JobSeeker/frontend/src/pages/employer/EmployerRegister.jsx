import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-blue-600">
            Jobseeker
          </NavLink>
        </div>
      </header>

      <main className="flex-grow flex justify-center items-center px-4">
        <div className="bg-blue-50 rounded-xl py-15 px-8 w-full max-w-md shadow-sm">
          <p className="text-sm text-gray-600 mb-1">
            Are you looking for{" "}
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              a job?
            </Link>
          </p>
          <h2 className="text-center text-2xl font-bold mb-6">
            Register as an Employer
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 mt-4">
            Already have account?{" "}
            <Link to="/employer/sign-in" className="text-blue-600 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © 2023 Copyright: Jobstreet .com
      </footer>
    </div>
  );
}
