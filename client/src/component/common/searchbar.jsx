// components/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({
  onSearch,
  location: initialLocation = '',
  minPrice: initialMinPrice = '',
  maxPrice: initialMaxPrice = '',
  propertyType: initialPropertyType = '',
}) => {
  // States for the search inputs
  const [location, setLocation] = useState(initialLocation);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [propertyType, setPropertyType] = useState(initialPropertyType);

  useEffect(() => {
    if (location) {
      fetchLocationSuggestions(location);
    } else {
      setLocationSuggestions([]);
    }
  }, [location]);

  const fetchLocationSuggestions = async input => {
    try {
      const res = await axios.get('/api/properties/suggestions', {
        params: { location: input },
      });

      setLocationSuggestions(res.data.suggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  const handleSearch = () => {
    onSearch({
      location,
      minPrice,
      maxPrice,
      propertyType,
    });
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Location"
          className="p-2 border rounded-md w-full"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        {locationSuggestions.length > 0 && (
          <ul className="absolute w-full bg-white shadow-lg z-10">
            {locationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setLocation(suggestion);
                  setLocationSuggestions([]); // Clear suggestions after selection
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="number"
        placeholder="Min Price"
        className="p-2 border rounded-md"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Price"
        className="p-2 border rounded-md"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
      />
      <select
        className="p-2 border rounded-md"
        value={propertyType}
        onChange={e => setPropertyType(e.target.value)}
      >
        <option value="">Select Property Type</option>
        <option value="HOUSE">House</option>
        <option value="APARTMENT">Apartment</option>
        <option value="LAND">Land</option>
      </select>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
