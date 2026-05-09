import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

// ✅ Import the full Home page (not just Hero)
import Home from "./pages/Home"; 

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Templates from "./pages/Templates";
import MyResumes from "./pages/MyResumes";
import GlobalLayout from "./pages/GlobalLayout";

import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";

import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: token },
        });

        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
      }
    } catch (error) {
      console.log(error.message);
      // Optional: Clear invalid token if API fails
      // localStorage.removeItem("token");
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      {/* ✅ Optimized Toaster Position & Style */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#ffc700', // Matches your brand yellow
              secondary: '#000',
            },
          },
        }}
      />

      <Routes>
        {/* ✅ Navbar Everywhere (GlobalLayout) */}
        <Route path="/" element={<GlobalLayout />}>
          
          {/* ✅ Landing Page (Full Page) */}
          <Route index element={<Home />} />

          {/* ✅ Protected App Pages */}
          <Route path="app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="templates" element={<Templates />} />
            <Route path="resumes" element={<MyResumes />} />
            <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          </Route>

          {/* ✅ Public Preview */}
          <Route path="view/:resumeId" element={<Preview />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;