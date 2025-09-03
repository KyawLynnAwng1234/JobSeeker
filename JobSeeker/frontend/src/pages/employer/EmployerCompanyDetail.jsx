import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../hooks/useEmployerAuth";

export default function EmployerCompanyDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submitCompanyDetail } = useEmployerAuth();
  const email = location.state?.email || "you@email.com";

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("employerUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const profile = {
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      business_name: e.target.business_name.value,
      city: e.target.city.value,
    };

    try {
      await submitCompanyDetail(profile);
      alert("Account created successfully!");
      navigate("/employer/dashboard");
    } catch (err) {
      console.error("Error 👉", err);
      alert("Failed: " + JSON.stringify(err.message || err));
    } finally {
      setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-900">Seek Employer</h1>
        <div className="text-gray-700 cursor-pointer">{user?.username || user?.email || "Employer"} ▼</div>
      </header>

      {/* Main Form */}
      <main className="flex flex-col items-center py-10">
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">
            Your employer Account Create
          </h2>
          <p className="text-gray-600 mb-4">
            You're almost done! We need some details about your business to
            verify your account. We won’t share your details with anyone.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="w-full px-3 py-2 bg-gray-100 text-gray-800">
                {email}
              </p>
            </div>

            {/* Full name + Last name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Full name</label>
                <input
                  name="first_name"
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last name</label>
                <input
                  name="last_name"
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                name="business_name"
                type="text"
                placeholder="We need your registered company name to verify your account."
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                name="city"
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition"
            >
              {loading ? "Creating..." : "Create New Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
