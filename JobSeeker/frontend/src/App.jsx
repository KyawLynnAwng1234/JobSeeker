
import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/homepage/Home";
// import JobSearch from "./pages/jobsearch/JobSearch";
// import Profile from "./pages/profile/Profile";
// import Companies from "./pages/companies/Companies";
// import CompanyAbout from "./pages/companies/CompanyAbout";

// Auth JobSeeker
import SignIn from "./pages/jobseeker/SignIn";
import VerifyOTP from "./pages/jobseeker/VerifyOTP";
// import ProfileMe from "./pages/profile/ProfileMe";

// Auth Employer
// import EmployerSignIn from "./pages/employer/EmployerSignIn";
// import EmployerRegister from "./pages/employer/EmployerRegister";

// Employer Layout & Pages
// import EmployerDashboardLayout from "./pages/employer/dashboard/EmployerDashboardLayout";
// import Overview from "./pages/employer/dashboard/Overview";
// import MyJobs from "./pages/employer/dashboard/MyJobs";

// ✅ Auth Context import
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    // ✅ Wrap whole app with AuthProvider

    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* JobSearch */}
          {/* <Route path="job-search" element={<JobSearch />} />
          <Route path="job-search/:id" element={<JobSearch />} />
          <Route path="/job-search/:id/detail" element={<JobSearch />} /> */}

          {/* Profile  */}
          {/* <Route path="profile" element={<Profile />} /> */}

          {/* Companies */}
          {/* <Route path="companies" element={<Companies />} />
          <Route path="companies/about" element={<CompanyAbout />} />
          <Route
            path="companies/about/available-jobs"
            element={<CompanyAbout />}
          /> */}

          {/* ✅ ProfileMe ကို login ဝင်မှသာ ရမယ် */}
          {/* <Route path="profile/me" element={<ProfileMe />} /> */}
        </Route>

        {/* Jobseeker Auth */}
        <Route path="sign-in" element={<SignIn />} />
        <Route path="verify" element={<VerifyOTP />} />

        {/* Employer Auth */}
        {/* <Route path="employer/sign-in" element={<EmployerSignIn />} />
        <Route path="employer/register" element={<EmployerRegister />} /> */}

        {/* Employer Dashboard routes */}
        {/* <Route path="/employer/dashboard" element={<EmployerDashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="my-jobs" element={<MyJobs />} />
        </Route> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
