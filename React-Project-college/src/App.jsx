import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Header/Navbar";
import Section2 from "./body/Section2";
import Quiz from "./Pages/Pricing/Quiz";
import Loging from "./Pages/Login/Loging";
import Getstarted from "./Pages/getstarted";
import Profile from "./Pages/Profile";
import Footer from "./body/Footer"; 
import History from "./Pages/History";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

const Home = () => <Section2 />;

const App = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      
      <Navbar />

      <div className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<Loging />} />
          <Route path="/getstarted" element={<Getstarted />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />

          {/* 🔥 ADD THESE ROUTES */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </div>

      <Footer />

    </div>
  );
};

export default App;