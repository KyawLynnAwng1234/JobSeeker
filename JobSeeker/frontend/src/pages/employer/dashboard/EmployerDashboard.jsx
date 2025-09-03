import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Briefcase, FileText, User, Settings, LogOut } from "lucide-react";

export default function EmployerDashboardLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);


 useEffect(() => {
  const fetchUser = async () => {
    try {
      const savedUser = localStorage.getItem("employerUser");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // ✅ Backend ထဲမှ latest user data လှမ်းယူ
        const res = await fetch(`http://localhost:8000/api/employers/${parsedUser.id}/`);
        const data = await res.json();

        setUser(data);

        // ✅ localStorage ထဲကို update လုပ်
        localStorage.setItem("employerUser", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  fetchUser();
}, []);



  const logout = () => {
    localStorage.removeItem("employerUser");
    navigate("/");
  };

  const emailNotVerified = !user?.is_verified;
  console.log(emailNotVerified)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-2xl font-bold text-blue-700">Employer</div>
        <nav className="space-y-2 p-4">
          <NavLink
            to="/employer/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              } ${emailNotVerified ? "pointer-events-none opacity-50" : ""}`
            }
          >
            <Briefcase className="mr-2" size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/employer/dashboard/my-jobs"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              } ${emailNotVerified ? "pointer-events-none opacity-50" : ""}`
            }
          >
            <FileText className="mr-2" size={18} /> My Job
          </NavLink>

          <NavLink
            to="/employer/dashboard/applications"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              } ${emailNotVerified ? "pointer-events-none opacity-50" : ""}`
            }
          >
            <User className="mr-2" size={18} /> Job Application
          </NavLink>

          <NavLink
            to="/employer/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              } ${emailNotVerified ? "pointer-events-none opacity-50" : ""}`
            }
          >
            <User className="mr-2" size={18} />Profile
          </NavLink>

          <NavLink
            to="/employer/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              } ${emailNotVerified ? "pointer-events-none opacity-50" : ""}`
            }
          >
            <Settings className="mr-2" size={18} /> Setting
          </NavLink>
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
                <span>{user?.username || user?.email || "Employer"}</span>
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
                    onClick={logout}
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
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4">
              <span>Please verify your email to access the dashboard.</span>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
