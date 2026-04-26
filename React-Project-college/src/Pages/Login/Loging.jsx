import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../api/auth";

const Loging = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      // ✅ store user + token
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      // 🔥 refresh to update navbar
      window.location.href = "/";

    } catch (error) {
      console.error(error);
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black to-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/10 h-120 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-2xl">
          <h2 className="flex justify-center bg-linear-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent text-3xl font-semibold">
            WELCOME BACK
          </h2>

          <form onSubmit={handleSubmit} className="py-7">
            <label className="text-gray-300 text-sm">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full mt-2 mb-4 px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full mt-2 mb-4 px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-linear-to-r from-purple-500 to-purple-700 text-white font-semibold"
            >
              Login
            </button>
          </form>

          <p className="text-gray-300 text-sm">
            Are You New Member?{" "}
            <Link to="/getstarted" className="hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loging;