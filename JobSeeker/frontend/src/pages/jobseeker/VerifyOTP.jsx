import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/userAuth";

const VerifyOTP = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const { loading, message, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) navigate("/sign-in");
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(paste)) {
      const pasteArr = paste.split("");
      setCode((prev) => {
        const newCode = [...prev];
        for (let i = 0; i < pasteArr.length; i++) newCode[i] = pasteArr[i];
        return newCode;
      });
      if (paste.length < 6) inputsRef.current[paste.length]?.focus();
    }
  };

  const handleVerifyClick = () => {
    const otp = code.join("");
    verifyOTP(email, otp,);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-[Inter]">
      <header className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-900 select-none">Jobseeker</h1>
      </header>

      <main className="flex-grow flex justify-center items-center px-4">
        <div className="bg-blue-50 rounded-xl p-8 w-full max-w-md shadow-md text-center">
          <p className="mb-4">Check Your email for a code</p>
          <p className="mb-6 text-sm">Enter the 6-digit code we sent to {email || "your email"}</p>

          <div className="flex justify-center gap-2 mb-6">
            {code.map((digit, index) =>(
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                autoComplete="one-time-code"
                aria-label={`OTP digit ${index + 1}`}
                placeholder="-"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyClick}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>

          {message && (
            <p className={`mt-3 text-sm ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <p className="mt-4 text-sm text-gray-700">Back in sign in options</p>
        </div>
      </main>

      <footer className="h-12 flex items-center justify-center border-t border-gray-200 text-sm text-gray-500">
        © 2023 Copyright: Jobstreet .com
      </footer>
    </div>
  );
};

export default VerifyOTP;
