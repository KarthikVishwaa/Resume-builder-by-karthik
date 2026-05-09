import React from "react";

import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Testimonial from "../components/home/Testimonial";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] relative overflow-x-hidden">
      
      {/* ✅ Consistent Background Texture */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40" 
        style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ></div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <Testimonial />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
};

export default Home;