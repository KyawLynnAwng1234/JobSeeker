import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState(null); // 🔹 email state
  const navigate = useNavigate();

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  useEffect(() => {
    // 🔹 LocalStorage ထဲက email ယူမယ်
    const savedUser = localStorage.getItem("employerUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setEmail(parsedUser.email);
    }

    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/accounts-employer/employer/profile/",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
              "X-CSRFToken": getCSRFToken(),
            },
          }
        );

        const emp = res.data.employer_profile[0];
        setProfile(emp);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-sky-50 flex">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">Employee Profile</h1>

        <section className="relative bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <img
              src={
                profile.logo
                  ? `http://127.0.0.1:8000${profile.logo}`
                  : "/default-logo.png"
              }
              alt="Logo"
              className="w-24 h-24 rounded-full object-cover"
            />

            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-base text-gray-500 mt-1">
                Company Name : {profile.business_name ?? "N/A"}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Email Column */}
                <div className="flex items-center gap-2 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M2.94 5.5A2.5 2.5 0 015.4 4h9.2a2.5 2.5 0 012.46 1.5L10 9 2.94 5.5z" />
                    <path d="M18 8.11V14.5A2.5 2.5 0 0115.5 17h-11A2.5 2.5 0 012 14.5V8.11l8 3.6 8-3.6z" />
                  </svg>
                  <span className="text-base">{email ?? "N/A"}</span>
                </div>

                {/* City Column */}
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">{profile.city ?? "N/A"}</span>
                </div>

                {/* Website */}
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">{profile.website ?? "N/A"}</span>
                </div>

                {/* Industry */}
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">{profile.industry ?? "N/A"}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">{profile.phone ?? "N/A"}</span>
                </div>

                {/* Size */}
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">{profile.size ?? "N/A"}</span>
                </div>

                {/* Founded Year */}
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">
                    {profile.founded_year ?? "N/A"}
                  </span>
                </div>

                {/* Contact Email */}
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">
                    {profile.contact_email ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8" />
          </div>

          <div
            onClick={() => navigate("/employer/dashboard/profile/edit")}
            className="absolute top-0 right-0 p-6 text-3xl font-bold cursor-pointer"
          >
            +
          </div>
        </section>
      </main>
    </div>
  );
}
