import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const GlobalLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar sits at the top */}
      <Navbar />
      
      {/* Main content takes remaining space - NO padding/margins here */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default GlobalLayout;