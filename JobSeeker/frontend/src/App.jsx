import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/homepage/Home";

import JobSearch from "./pages/jobsearch/JobSearch";
import JobSearchAll from "./pages/jobsearch/JobSearchAll";
import JobSearchDetail from "./pages/jobsearch/JobSearchDetail";

import Profile from "./pages/profile/Profile";

import Companies from "./pages/companies/Companies";
import CompanyAbout from "./pages/companies/CompanyAbout";

// Auth JobSeeker
import SignIn from "./pages/jobseeker/SignIn";
import VerifyOTP from "./pages/jobseeker/VerifyOTP";

// ProfileMe for user
import ProfileMe from "./pages/profile/ProfileMe";

// Auth Employer
import EmployerSignIn from "./pages/employer/EmployerSignIn";
import EmployerRegister from "./pages/employer/EmployerRegister";
import EmployerCompanyDetail from "./pages/employer/EmployerCompanyDetail";

// Test Page
// import RateLimitTest from "./pages/RateLimitTest";
// import RateLimitDemo from "./pages/RateLimitDemo";

// Employer Layout & Pages
import EmployerDashboardLayout from "./pages/employer/dashboard/EmployerDashboard";
import Overview from "./pages/employer/dashboard/OverView";

import MyJobs from "./pages/employer/jobs-page/MyJobs";
import EditJob from "./pages/employer/jobs-page/EditJob";
import PostJob from "./pages/employer/jobs-page/PostJob";
import JobDetail from "./components/employer/jobs/JobDetail";

import JobCategoryListPage from "./pages/employer/job-categories-page/JobCategoryListPage";
import JobCategoryCreatePage from "./pages/employer/job-categories-page/JobCategoryCreatePage";
import JobCategoryEditPage from "./pages/employer/job-categories-page/JobCategoryEditPage";
import JobCategoryDetailPage from "./pages/employer/job-categories-page/JobCategoryDetailPage";

import EmployerProfile from "./pages/employer/profile/EmployerProfile";
import EmployerProfileEdit from "./pages/employer/profile/EmployerProfileEdit";

// ✅ Auth Context import
import { AuthProvider } from "./context/AuthContext";
import { EmployerAuthProvider } from "./context/EmployerAuthContext";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    // ✅ Wrap whole app with AuthProvider

    <AuthProvider>
      <EmployerAuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Home */}
            <Route index element={<Home />} />

            <Route path="job-search" element={<JobSearch />} />
            <Route path="job-search/:id" element={<JobSearch />} />
            <Route path="job-search/:id/detail" element={<JobSearch />} />
            <Route path="job-search/all" element={<JobSearchAll />} />
            <Route path="job-search/detail" element={<JobSearchDetail />} />

            <Route path="profile" element={<Profile />} />

            <Route path="companies" element={<Companies />} />
            <Route path="companies/about" element={<CompanyAbout />} />
            <Route path="companies/about/available-jobs" element={<CompanyAbout />} />

            <Route
              path="profile/me"
              element={
                <ProtectedRoute>
                  <ProfileMe />
                </ProtectedRoute>
              }
            />
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

            {/* job */}
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="job-create" element={<PostJob />} />
            <Route path="my-jobs/:id/edit" element={<EditJob />} />
            <Route path="my-jobs/:id/detail" element={<JobDetail />} />

            {/* job-category */}
            <Route path="job-category" element={<JobCategoryListPage />} />
            <Route
              path="job-category/create"
              element={<JobCategoryCreatePage />}
            />
            <Route
              path="job-categories/:id/edit"
              element={<JobCategoryEditPage />}
            />
            <Route
              path="job-categories/:id"
              element={<JobCategoryDetailPage />}
            />

            <Route path="profile" element={<EmployerProfile />} />
            <Route path="profile/edit" element={<EmployerProfileEdit />} />
          </Route>
        </Routes>
      </EmployerAuthProvider>
    </AuthProvider>
  );
}

export default App;
