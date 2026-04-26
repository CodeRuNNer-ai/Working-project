import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl text-gray-400 px-6 md:px-20 py-10">
      
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* 🔹 Brand */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-2">
            YT Notes AI
          </h2>
          <p className="text-sm">
            Turn YouTube videos into smart notes, quizzes, and PDFs instantly.
          </p>
        </div>

        {/* 🔹 Navigation Links */}
        <div>
          <h3 className="text-white font-medium mb-2">Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/price" className="hover:text-white transition">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-white transition">
                History
              </Link>
            </li>
          </ul>
        </div>

        {/* 🔹 Legal */}
        <div>
          <h3 className="text-white font-medium mb-2">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* 🔻 Bottom */}
      <div className="mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} YT Notes AI • Built with ❤️
      </div>

    </footer>
  );
};

export default Footer;