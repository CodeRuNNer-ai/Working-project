import React from 'react'
import { Link,useNavigate } from "react-router-dom";
import { useState } from 'react'
import { signupUser } from "../api/auth";
const Getstarted = () => {
  const navigate = useNavigate();

  const [firstname, setfirstName]=useState("")
  const [lastname, setlastName]=useState("")
   const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
  
   const handleSubmit = async (e) => {
  e.preventDefault();

  const fullName = firstname + " " + lastname;

  try {
    const data = await signupUser({ name: fullName, email, password });

    if (data.token) {
      // store in browser
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      alert("Signup successful ✅");
      navigate("/"); // redirect to home
    } else {
      alert(data.msg || "Signup failed");
    }
  } catch (error) {
    console.error(error);
    alert(error.message || "Signup failed");
  }
};
  
    return (
      <div className='min-h-screen bg-linear-to-b from-black to-gray-900 flex items-center justify-center'>
        <div className="w-full max-w-md">
          <div className="bg-white/10 h-125 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-2xl">
            <h2 className='flex justify-center bg-linear-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent text-3xl font-semibold '>Create new account</h2>
            <form onSubmit={handleSubmit} className='py-7'>

              <input
                type="text"
                value={firstname}
                onChange={(e) => setfirstName(e.target.value)}
                placeholder="First Name"
                className="w-full mt-2 mb-4 px-4 py-3 rounded-lg 
                  bg-transparent border border-white/30 
                 text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500 
                 focus:border-purple-500 transition"
              />

              <input
                type="text"
                value={lastname}
                onChange={(e) => setlastName(e.target.value)}
                placeholder="Last Name"
                className="w-full mt-2 mb-4 px-4 py-3 rounded-lg 
                  bg-transparent border border-white/30 
                 text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500 
                 focus:border-purple-500 transition"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full mt-2 mb-4 px-4 py-3 rounded-lg 
                  bg-transparent border border-white/30 
                 text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500 
                 focus:border-purple-500 transition"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="P@ssword"
                className="w-full mt-2 mb-4 px-4 py-3 rounded-lg 
                    bg-transparent border border-white/30 
                   text-white placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-purple-500 
                   focus:border-purple-500 transition"
              />
              <button 
                type="submit"
                  className="w-full py-3 rounded-lg 
                  bg-linear-to-r from-purple-500 to-purple-700 
                  text-white font-semibold 
                  border border-white/40 
                  shadow-[0_0_10px_rgba(255,255,255,0.3)] 
                  hover:opacity-90 transition">Sign Up
                  </button>
            </form>
            <p className='text-gray-300 text-sm'>Already A Member? <Link to="/login" className=" text-sm hover:underline"> Log in </Link></p> 
  
          </div>
        </div>
      </div>
    )
  }

export default Getstarted
