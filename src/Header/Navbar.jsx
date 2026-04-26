import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/price" },
  { name: "Login", path: "/login" },
  { name: "Get Started", path: "/getstarted" },
];

const Navbar = () => {
  const location = useLocation();

  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // 👇 Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // hide on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      // blur increase after scroll
      setScrolled(currentScroll > 50);

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 flex justify-center pt-4"
    >
      <div
        className={`
          relative flex gap-2 px-3 py-2 rounded-full transition-all duration-300
          ${scrolled 
            ? "bg-white/20 backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.6)]" 
            : "bg-white/10 backdrop-blur-md"}
          border border-white/20
        `}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className="relative px-5 py-2 text-white text-sm z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="pill"
                  className="
                    absolute inset-0 rounded-full
                    bg-white/20 backdrop-blur-md
                    shadow-[0_0_15px_rgba(255,255,255,0.3)]
                  "
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )}

              <span className="relative z-10">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Navbar;