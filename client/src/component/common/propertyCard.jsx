import React from 'react';
import { Heart } from 'lucide-react';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative">
        <img 
          src={property.image || "/api/placeholder/400/300"} 
          alt={property.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <button className="p-2 bg-white rounded-full hover:bg-gray-100">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-blue-500 text-white text-sm rounded">
            {property.type}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold">Rs. {property.price}</span>
          <span className="text-sm text-gray-500">{property.area} sq.ft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;