import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/homepage/Home";

// Auth JobSeeker
import SignIn from "./pages/jobseeker/SignIn";
import VerifyOTP from "./pages/jobseeker/VerifyOTP";

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
        </Route>

        {/* Jobseeker Auth */}
        <Route path="sign-in" element={<SignIn />} />
        <Route path="verify" element={<VerifyOTP />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
