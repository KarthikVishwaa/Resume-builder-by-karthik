import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../app/features/authSlice";

import {
  HomeIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  FileTextIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ChevronRightIcon,
  UserIcon,
  MailIcon,
  ShieldCheckIcon,
  Sparkles,
  HeartHandshake
} from "lucide-react";

// --- SUB-COMPONENT: User Profile Detail Modal ---
const UserProfileModal = ({ user, isOpen, onClose, onLogoutClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300 animate-fade-in" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-spring-up border border-gray-100">
        
        {/* Decorative Header */}
        <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800 relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <XIcon className="size-4" />
            </button>
            <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffc700] to-[#ffae00] flex items-center justify-center text-black text-3xl font-bold shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase()}
                </div>
            </div>
        </div>

        <div className="pt-12 pb-6 px-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <MailIcon className="size-3.5" />
                    {user?.email}
                </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <ShieldCheckIcon className="size-3.5 text-green-600" />
                        Status
                    </div>
                    <span className="font-bold text-gray-900">Active</span>
                </div>
                <div className="p-3 bg-[#fffdf5] rounded-xl border border-[#ffc700]/20 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#b78100] uppercase tracking-wide">
                        <Sparkles className="size-3.5" />
                        Plan
                    </div>
                    <span className="font-bold text-gray-900">Free Tier</span>
                </div>
            </div>

            <div className="h-px bg-gray-100 mb-6" />

            <button 
                onClick={onLogoutClick}
                className="w-full py-3 rounded-xl border border-red-100 text-red-600 font-semibold hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
                <LogOutIcon className="size-4" />
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Emotional Logout Confirmation ---
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity duration-500 animate-fade-in" 
          onClick={onClose}
        />
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 transform transition-all animate-spring-modal text-center">
          
          <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
             <HeartHandshake className="size-8 text-[#ffc700]" />
          </div>
  
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Ohh no! We'll be waiting for your return. <br/>
            Your resumes will be safe here.
          </p>
  
          <div className="flex gap-3">
            <button 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors active:scale-95"
            >
                Stay
            </button>
            <button 
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
                Log Out
            </button>
          </div>
        </div>
      </div>
    );
  };

// --- MAIN COMPONENT: Navbar ---
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    setShowProfileModal(false);
    setIsOpen(false);
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: HomeIcon, public: true },
    { name: "Dashboard", path: "/app", icon: LayoutDashboardIcon, public: false },
    { name: "Templates", path: "/app/templates", icon: LayoutTemplateIcon, public: false },
    { name: "My Resumes", path: "/app/resumes", icon: FileTextIcon, public: false },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-500 ease-in-out ${
            scrolled 
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2" // Scrolled: Stark White
            : "bg-[#F9FAFB]/90 backdrop-blur-md border-b border-transparent py-4" // Top: Matches Page Background
        }`}
      >
        <nav className="flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
            
            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 z-50 group">
              <div className="leading-tight">
                <p className="font-bold text-[18px] text-gray-900 tracking-tight font-display">
                  QuantaWeave
                </p>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest group-hover:text-[#ffc700] transition-colors duration-300">
                  AI Resume Studio
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-gray-200/40 p-1 rounded-full border border-gray-200/50 shadow-inner backdrop-blur-md">
              {navLinks.map((link) => {
                if (!link.public && !user) return null;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/" || link.path === "/app"}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden group ${
                        isActive
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <link.icon
                          className={`size-4 transition-colors duration-300 ${
                            isActive ? "text-[#ffc700]" : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        {link.name}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Desktop Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    to="/app?state=login"
                    className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/app?state=register"
                    className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-0.5 active:scale-95"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button 
                    onClick={() => setShowProfileModal(true)}
                    className={`flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 group
                        ${scrolled ? "bg-white border-gray-200" : "bg-[#F9FAFB] border-gray-200/60"}
                    `}
                >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ffc700] to-[#ffae00] text-black font-bold text-xs shadow-inner transform group-hover:scale-105 transition-transform">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                        {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronRightIcon className="size-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden z-50 p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90"
            >
              {isOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu (Matches #F9FAFB) */}
        <div
          className={`fixed inset-x-0 top-[72px] bottom-0 bg-[#F9FAFB]/95 backdrop-blur-xl md:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.725,0.0,1.0)] ${
            isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
          }`}
          style={{ height: 'calc(100vh - 72px)' }} 
        >
          <div className="p-6 flex flex-col h-full overflow-y-auto">
              
              <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                      if (!link.public && !user) return null;
                      return (
                      <NavLink
                          key={link.path}
                          to={link.path}
                          end={link.path === "/" || link.path === "/app"}
                          style={{ 
                              transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                              opacity: isOpen ? 1 : 0,
                              transform: isOpen ? 'translateY(0)' : 'translateY(10px)'
                          }}
                          className={({ isActive }) =>
                          `flex items-center justify-between p-4 rounded-2xl transition-all duration-500 ease-out ${
                              isActive
                              ? "bg-white text-gray-900 font-bold shadow-sm"
                              : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
                          }`
                          }
                      >
                          <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-xl ${location.pathname === link.path ? 'bg-gray-50 shadow-inner' : 'bg-transparent'}`}>
                                  <link.icon className={`size-5 ${location.pathname === link.path ? 'text-[#ffc700]' : 'text-current'}`} />
                              </div>
                              <span className="text-base">{link.name}</span>
                          </div>
                          <ChevronRightIcon className="size-5 text-gray-300" />
                      </NavLink>
                      );
                  })}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

              <div 
                  className="mt-auto flex flex-col gap-4 pb-8 transition-all duration-700 ease-out"
                  style={{ 
                      transitionDelay: isOpen ? '200ms' : '0ms',
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(20px)'
                  }}
              >
                  {!user ? (
                  <>
                      <Link
                      to="/app?state=login"
                      className="w-full py-3.5 rounded-2xl border border-gray-200 text-center font-semibold text-gray-700 hover:bg-white active:scale-[0.98] transition-all"
                      >
                      Log in
                      </Link>
                      <Link
                      to="/app?state=register"
                      className="w-full py-3.5 rounded-2xl bg-[#ffc700] text-black text-center font-bold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
                      >
                      Get Started
                      </Link>
                  </>
                  ) : (
                  <div className="flex flex-col gap-4">
                      {/* Mobile Profile Card */}
                      <button 
                        onClick={() => { setShowProfileModal(true); setIsOpen(false); }}
                        className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 w-full text-left active:scale-[0.98] transition-transform shadow-sm"
                      >
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ffc700] to-[#ffae00] text-black font-bold text-lg shadow-sm">
                              {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                              <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
                              <p className="text-sm text-gray-500">View Account</p>
                          </div>
                          <ChevronRightIcon className="ml-auto text-gray-400" />
                      </button>

                      <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-red-600 bg-red-50 font-semibold hover:bg-red-100 active:scale-[0.98] transition-all"
                      >
                      <LogOutIcon className="size-5" />
                      Sign Out
                      </button>
                  </div>
                  )}
              </div>
          </div>
        </div>
      </header>
      
      {/* Modals */}
      <UserProfileModal 
        user={user} 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)}
        onLogoutClick={() => setShowLogoutModal(true)} 
      />

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogoutConfirm} 
      />

      {/* Animation Styles */}
      <style>{`
        @keyframes springModal {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes springUp {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-spring-modal { animation: springModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-spring-up { animation: springUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-bounce-subtle { animation: bounceSubtle 2s infinite ease-in-out; }
      `}</style>
    </>
  );
};

export default Navbar;