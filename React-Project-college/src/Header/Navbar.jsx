import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  // 🔹 Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // 🔹 Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setHidden(currentScroll > lastScroll && currentScroll > 80);
      setScrolled(currentScroll > 50);
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // 🔥 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const baseTabs = [
    { name: "Home", path: "/" },
    { name: "Quiz", path: "/quiz" },
  ];

  return (
    <motion.div
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 flex justify-center pt-4"
    >
      <div
        className={`relative flex items-center gap-2 px-3 py-2 rounded-full
        ${
          scrolled
            ? "bg-white/20 backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.6)]"
            : "bg-white/10 backdrop-blur-md"
        }
        border border-white/20`}
      >
        {/* 🔹 Base Tabs */}
        {baseTabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className="relative px-4 py-2 text-white text-sm"
            >
              {isActive && (
                <motion.div
                  layoutId="pill"
                  className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-md"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{tab.name}</span>
            </Link>
          );
        })}

        {/* 🔹 Guest */}
        {!user && (
          <>
            {[
              { name: "Login", path: "/login" },
              { name: "Get Started", path: "/getstarted" },
            ].map((tab) => {
              const isActive = location.pathname === tab.path;

              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className="relative px-4 py-2 text-white text-sm"
                >
                  {isActive && (
                    <motion.div
                      layoutId="pill"
                      className="absolute inset-0 rounded-full bg-white/20"
                    />
                  )}
                  <span className="relative z-10">{tab.name}</span>
                </Link>
              );
            })}
          </>
        )}

        {/* 🔥 Logged-in */}
        {user && (
          <>
            {/* History Tab */}
            <Link
              to="/history"
              className="relative px-4 py-2 text-white text-sm"
            >
              {location.pathname === "/history" && (
                <motion.div
                  layoutId="pill"
                  className="absolute inset-0 rounded-full bg-white/20"
                />
              )}
              <span className="relative z-10">History</span>
            </Link>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-2 text-white px-3"
              >
                {/* 🔥 Profile Image or fallback */}
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {user.name}
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-2 bg-black/80 backdrop-blur-lg rounded-lg w-40 border border-white/20 shadow-lg">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-white/10"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;