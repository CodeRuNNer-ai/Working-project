import React, { useState } from "react";
import Orb from "./Orb";

const Section2 = () => {
  const [url, setUrl] = useState("");

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Orb */}
      <div className="absolute inset-0 z-0">
        <Orb
          hoverIntensity={1}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          Paste YouTube Link
        </h1>

        <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center gap-3 shadow-xl pointer-events-auto">
          <input
            type="text"
            placeholder="https://youtube.com/..."
            className="flex-1 bg-transparent outline-none text-white px-4 py-3 placeholder-gray-300"
          />

          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Section2;