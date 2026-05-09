import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useSelector((state) => state.auth);

  return (
  <div className="min-h-screen">

      
      {/* ✅ Exact Same Container As Navbar */}
      <div className="relative flex flex-col items-center justify-center text-sm max-w-7xl mx-auto px-6 text-black pt-16">

        {/* Glow */}
        <div className="absolute top-20 -z-10 w-[420px] h-[420px] bg-[#ffc700] blur-[150px] opacity-20 rounded-full" />

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center leading-tight">
          Build your career with{" "}
          <span className="bg-gradient-to-r from-[#ffc700] to-[#ffae00] bg-clip-text text-transparent">
            AI-powered
          </span>{" "}
          resumes.
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-center text-base text-gray-600 my-7 leading-relaxed">
          QuantaWeave helps you create recruiter-ready resumes with premium
          templates, AI writing assistance, and one-click export.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          {!user ? (
            <>
              <Link
                to="/app?state=register"
                className="px-10 h-12 flex items-center justify-center rounded-full 
                bg-gradient-to-r from-[#ffc700] to-[#ffae00]
                text-black font-semibold shadow-md hover:opacity-90 transition"
              >
                Get Started
              </Link>

              <Link
                to="/app?state=login"
                className="px-10 h-12 flex items-center justify-center rounded-full 
                border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              to="/app"
              className="px-10 h-12 flex items-center justify-center rounded-full 
              bg-gradient-to-r from-[#ffc700] to-[#ffae00]
              text-black font-semibold shadow-md hover:opacity-90 transition"
            >
              Open Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
