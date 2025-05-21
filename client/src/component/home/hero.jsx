import React from 'react';
import { Search } from 'lucide-react'; // Import the Search icon

const Hero = () => {
  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="./vid/0108.mp4" type="video/mp4" /> {/* Ensure the video path is correct */}
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center bg-white bg-opacity-80 p-4 rounded-md">
        <input
          type="text"
          placeholder="Search for property..."
          className="border-none p-2 text-lg w-80 focus:outline-none"
        />
        <button className="bg-blue-500 text-white border-none p-2 rounded-md ml-2">
          <Search /> {/* Use the Search icon from lucide-react */}
        </button>
      </div>
    </div>
  );
};

export default Hero;
