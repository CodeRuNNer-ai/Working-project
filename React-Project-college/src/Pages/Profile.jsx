import React, { useState } from "react";
import { updateProfile } from "../api/auth";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(storedUser.name);
  const [email, setEmail] = useState(storedUser.email);
  const [profilePic, setProfilePic] = useState(storedUser.profilePic || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await updateProfile({ name, email, profilePic });

    localStorage.setItem("user", JSON.stringify(res.user));

    alert("Profile updated!");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black to-gray-900 flex items-center justify-center">

      {/* 🔥 Glass Card */}
      <div className="w-full max-w-md p-6 rounded-3xl 
        bg-white/10 backdrop-blur-xl 
        border border-white/20 
        shadow-[0_0_30px_rgba(0,0,0,0.6)]">

        <h2 className="text-3xl text-center mb-6 font-semibold 
        bg-linear-to-r from-purple-300 to-purple-500 
        bg-clip-text text-transparent">
          Profile
        </h2>

        {/* 🔥 Profile Image */}
        <div className="flex justify-center mb-5">
          {profilePic ? (
            <img
              src={profilePic}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border border-white/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 
            flex items-center justify-center text-xl text-white border border-white/30">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-gray-300 text-sm">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg 
              bg-transparent border border-white/30 
              text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg 
              bg-transparent border border-white/30 
              text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Profile Pic */}
          <div>
            <label className="text-gray-300 text-sm">Profile Image URL</label>
            <input
              type="text"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              placeholder="Paste image URL"
              className="w-full mt-2 px-4 py-3 rounded-lg 
              bg-transparent border border-white/30 
              text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg 
            bg-linear-to-r from-purple-500 to-purple-700 
            text-white font-semibold 
            border border-white/40 
            shadow-[0_0_15px_rgba(255,255,255,0.3)] 
            hover:opacity-90 transition"
          >
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;