import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/homepage/Home";

// Auth JobSeeker
import SignIn from "./pages/jobseeker/SignIn";
import VerifyOTP from "./pages/jobseeker/VerifyOTP";

// Auth Employer
import EmployerSignIn from "./pages/employer/EmployerSignIn";
import EmployerRegister from "./pages/employer/EmployerRegister";
import EmployerCompanyDetail from "./pages/employer/EmployerCompanyDetail";

<<<<<<< HEAD

=======
// Test Page
import RateLimitTest from "./pages/RateLimitTest";
// import RateLimitDemo from "./pages/RateLimitDemo";
>>>>>>> b1df11127aaa63fb678e76c268559f339127880a

// Employer Layout & Pages
import EmployerDashboardLayout from "./pages/employer/dashboard/EmployerDashboard";
import Overview from "./pages/employer/dashboard/OverView";
import MyJobs from "./pages/employer/dashboard/MyJobs";
import JobCategory from "./pages/employer/dashboard/JobCategory";

// ✅ Auth Context import
import { AuthProvider } from "./context/AuthContext";
import { EmployerAuthProvider } from "./context/EmployerAuthContext";




function App() {
  return (
    // ✅ Wrap whole app with AuthProvider

    <AuthProvider>
      <EmployerAuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Home */}
            <Route index element={<Home />} />
          </Route>

          {/* Jobseeker Auth */}
          <Route path="sign-in" element={<SignIn />} />
          <Route path="verify" element={<VerifyOTP />} />

          {/* Employer Auth */}
          <Route path="employer/sign-in" element={<EmployerSignIn />} />
          <Route path="employer/register" element={<EmployerRegister />} />
          <Route
            path="employer/company/detail"
            element={<EmployerCompanyDetail />}
          />
          
    

          {/* Employer Auth */}
          <Route
            path="/employer/dashboard"
            element={<EmployerDashboardLayout />}
          >
            <Route index element={<Overview />} />
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="category" element={<JobCategory />} />
          </Route>
        </Routes>
      </EmployerAuthProvider>
    </AuthProvider>
  );
}

export default App;
