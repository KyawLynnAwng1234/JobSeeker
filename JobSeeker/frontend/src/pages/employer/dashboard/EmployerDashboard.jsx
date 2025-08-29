import { NavLink, Outlet } from "react-router-dom";
import { Briefcase, FileText, User, Settings } from "lucide-react";

export default function EmployerDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-2xl font-bold text-blue-700">Employer</div>
        <nav className="space-y-2 p-4">
          <NavLink
            to="/employer/dashboard"
            end   // ✅ "Overview" ကို open လုပ်တဲ့အချိန် Dashboard active ဖြစ်ဖို့
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <Briefcase className="mr-2" size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/employer/dashboard/my-jobs"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <FileText className="mr-2" size={18} /> My Job
          </NavLink>

          <NavLink
            to="/employer/dashboard/applications"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <User className="mr-2" size={18} /> Job Application
          </NavLink>

          <NavLink
            to="/employer/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <User className="mr-2" size={18} /> Profile
          </NavLink>

          <NavLink
            to="/employer/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <Settings className="mr-2" size={18} /> Setting
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="flex justify-between items-center bg-white p-4 shadow-sm">
          <NavLink to="/" className="text-gray-600 hover:text-blue-600">Home</NavLink>
          <div className="flex items-center space-x-4">
            <button>🔔</button>
            <button>📩</button>
            <img src="https://i.pravatar.cc/40" alt="profile" className="w-8 h-8 rounded-full"/>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
