import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useEmployerAuth } from "../../hooks/useEmployerAuth";

const EmployerSignIn = () => {
  const { signin } = useEmployerAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signin({ email, password });
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.message || "Sign In failed!");
    } finally {
      setLoading(false);
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

      {/* Card */}
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="bg-blue-50 rounded-xl py-15 px-8 w-full max-w-md shadow-sm">
          <p className="text-sm text-gray-600 mb-1">
            Are you looking for{" "}
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              a job?
            </Link>
          </p>
          <h2 className="text-center text-2xl font-bold mb-6">
            Sign In as an Employer
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end text-sm">
              <Link to="/employer/forgot-password" className="text-blue-600">
                Forget Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 mt-4">
            Already have your account?{" "}
            <Link to="/employer/register" className="text-blue-600 font-medium">
              Register
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
};

export default EmployerSignIn;
