import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Loader from "../components/Loader";
import Login from "./Login";

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // ✅ 1. Loading State (Centered & Animated)
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="relative">
            <div className="absolute inset-0 bg-[#ffc700]/20 rounded-full blur-xl animate-pulse"></div>
            <Loader className="relative z-10" />
        </div>
      </div>
    );
  }

  // ✅ 2. Not Logged In → Login Page (Slide Up Animation)
  if (!user) {
    return (
      <div className="flex-1 flex flex-col animate-slide-up-fade">
        <Login />
      </div>
    );
  }

  // ✅ 3. Authenticated App (Fade In)
  return (
    <div className="w-full h-full flex flex-col animate-fade-in">
      {/* Note: We removed 'min-h-screen' here because GlobalLayout 
          already handles the full height background. 
          This ensures seamless scrolling.
      */}
      <Outlet />

      {/* Animation Styles (Scoped) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Layout;