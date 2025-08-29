import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../hooks/useEmployerAuth";

const EmployerSignIn = () => {
  const { login } = useEmployerAuth();
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
      await login({ email, password });
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      {/* Logo */}
      <div className="absolute top-6 left-10">
        <h1 className="text-2xl font-bold text-blue-900">Jobseeker</h1>
      </div>

      {/* Card */}
      <div className="bg-blue-50 rounded-xl py-10 px-8 w-full max-w-md shadow-sm">
        <p className="text-sm text-gray-600 mb-2">
          Are you looking for{" "}
          <Link to="/sign-in" className="text-blue-600">
            a job?
          </Link>
        </p>
        <h2 className="text-center text-2xl font-bold mb-6">Sign In as an Employer</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © 2023 Copyright: Jobstreet .com
      </footer>
    </div>
  );
};

export default EmployerSignIn;
