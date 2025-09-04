import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Briefcase, FileText, User, Settings, LogOut } from "lucide-react";
import { useEmployerAuth } from "../../../hooks/useEmployerAuth";

export const sidebarItems = [
  { route: "/", label: "Dashboard", icon: Briefcase },
  { route: "/my-jobs", label: "My Job", icon: FileText },
  {
    route: "/applications",
    label: "Job Application",
    icon: User,
  },
  { route: "/profile", label: "Profile", icon: User },
  { route: "/settings", label: "Settings", icon: Settings },
];

export default function EmployerDashboardLayout() {
  const { employer, logout, resendEmail, loading } = useEmployerAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  const emailNotVerified = !employer?.is_verified;
  console.log(emailNotVerified);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-2xl font-bold text-blue-700">Employer</div>
        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.route}
                to={`/employer/dashboard/${
                  item.route === "dashboard" ? "" : item.route
                }`}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100"
                  } ${emailNotVerified ? "pointer-events-none opacity-50" : ""}`
                }
              >
                <Icon className="mr-2" size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="flex justify-between items-center bg-white p-4 shadow-sm">
          <NavLink to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </NavLink>
          <div className="flex space-x-4">
            <button>🔔</button>
            <button>📩</button>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
              >
                <User size={18} />
                <span>
                  {employer?.username || employer?.email || "Employer"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <button
                    onClick={() => navigate("/employer/dashboard")}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    <Briefcase className="mr-2" size={18} /> Dashboard
                  </button>
                  <button
                    onClick={
                      () => {
                        logout();
                        navigate("/");
                      }
                    }
                    className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2" size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {emailNotVerified && (
            <div className="flex justify-between items-center p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4">
              <span>Please verify your email to access the dashboard.</span>
              <button
                onClick={resendEmail}
                className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Resend Email
              </button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
