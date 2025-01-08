import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; 

const VideoSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    
  };

  return (
    <div className="relative">
      <video
        src="/src/assets/0108.mp4"
        autoPlay
        loop
        muted
        className="w-full h-[400px] object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-4xl font-bold mb-4">Explore the Best Real Estate In Nepal</h1>
        <h2 className="text-white text-2xl font-semibold mb-6">Find your dream home</h2>
        <div className="flex items-center justify-center bg-white rounded-full p-2 w-3/4 md:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for properties..."
            className="w-full p-2 rounded-l-full border-none focus:outline-none"
          />
          <button
            onClick={handleSearchSubmit}
            className="p-2 bg-blue-500 text-white rounded-r-full"
          >
            <FaSearch />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
