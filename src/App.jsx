import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Header/Navbar";
import Section2 from "./body/Section2";
import Price from "./Pages/Pricing/Price";
import Loging from "./Pages/Login/Loging";
import Getstarted from "./Pages/getstarted";

const Home = () => <Section2 />

const App = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/price" element={<Price />} />
        <Route path="/login" element={<Loging />} />
        <Route path="/getstarted" element={<Getstarted />} />
      </Routes>
    </div>
  );
};

export default App;