import React from 'react';
import { Heart, Bed, Bath, Ruler } from 'lucide-react';

const PropertyCard = ({ property, onClick }) => {
  const { title, location, price, area, type, bedrooms, bathrooms, images } = property;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 w-[300px] cursor-pointer"
      onClick={onClick} // Attach the onClick handler here
    >
      <div className="relative">
        <img
          src={images?.[0] || '/api/placeholder/400/300'}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <button
            className="p-2 bg-white rounded-full hover:bg-gray-100"
            onClick={(e) => e.stopPropagation()} // Prevent button click from triggering card navigation
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-blue-500 text-white text-sm rounded">{type}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{location}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold">Rs. {price}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Bed className="mr-2" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="mr-2" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Ruler className="mr-2" />
            <span>{area} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;