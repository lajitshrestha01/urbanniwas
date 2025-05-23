import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utlis/axios';

const Hero = () => {
  const [searchData, setSearchData] = useState('');
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Custom debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchData = useDebounce(searchData, 300);

  // Fetch properties when debouncedSearchData changes
  useEffect(() => {
    const fetchProperties = async () => {
      if (!debouncedSearchData.trim()) {
        setProperties([]);
        return;
      }

      setIsLoading(true);
      console.log('Fetching properties for:', { debouncedSearchData });

      try {
        const res = await api.get('/properties/', {
          params: { title: debouncedSearchData },
        });

        const newProperties = res?.data || []; // getProperties returns array
        setProperties(newProperties);
        setError(null);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to fetch properties');
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [debouncedSearchData]);

  // Handle clicking a search result
  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="./vid/0108.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center bg-white bg-opacity-80 p-4 rounded-md w-full max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for property..."
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
            className="border-none p-2 text-lg w-full focus:outline-none"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search />
          </button>
          {/* Search Results Dropdown */}
          {searchData && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto z-10">
              {isLoading && <div className="p-2 text-gray-500">Loading...</div>}
              {error && <div className="p-2 text-red-500">{error}</div>}
              {!isLoading && !error && properties.length === 0 && searchData && (
                <div className="p-2 text-gray-500">No properties found</div>
              )}
              {properties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => handlePropertyClick(property.id)}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <div>
                    <p className="font-semibold">{property.title}</p>
                    <p className="text-sm text-gray-500">
                      ${property.price.toLocaleString()} - {property.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
