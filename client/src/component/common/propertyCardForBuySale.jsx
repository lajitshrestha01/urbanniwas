import React, { useState } from "react"
import { Heart, Maximize2, Bed, Bath } from "lucide-react"

const PropertyCardBuySale = ({ property, onClick }) => {
  const { 
    title, 
    city, 
    price, 
    area, 
    type, 
    bedrooms, 
    bathrooms, 
    images, 
    createdAt,
  } = property;

  const [currentImageIndex, setCurrentImageIndex] = useState(1)
  const totalImages = images?.length || 6

  // ✅ Calculate listedDays from createdAt
  const calculateListedDays = () => {
    if (!createdAt) return "Date not available";

    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffTime = today - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Just listed";
    if (diffDays === 1) return "Listed 1 day ago";
    return `Listed ${diffDays} days ago`;
  }

  const listedDays = calculateListedDays();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden w-full mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-1/3">
          <img
            src={images?.[0] || "/placeholder.svg?height=300&width=400"}
            alt={title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="p-4 md:w-2/3 flex flex-col justify-between">
          <div className="flex justify-end gap-2 mb-2">
            <button className="p-1 border rounded-md hover:bg-gray-100">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-1 border rounded-md hover:bg-gray-100">
              <Maximize2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Price */}
          <h4 className="text-lg font-semibold mt-1">{title}</h4>
          <h5 className="text-xl font-bold text-gray-800">₹ {price.toLocaleString()}</h5>
          
          {/* Area and Type */}
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{area} Sq Ft</span>
            <span>{type}</span>
          </div>

          {/* Title and Location */}
          <p className="text-gray-600 text-sm mt-1">{city}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="flex items-center">
              <Bed className="w-5 h-5 mr-2 text-gray-600" />
              <span>{bedrooms}+ Bedroom</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-5 h-5 mr-2 text-gray-600" />
              <span>{bathrooms} Bathroom</span>
            </div>
          </div>

          <div className="border-t my-4" />

          {/* Bottom section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span>{listedDays}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  onClick()
                }}
              >
                VIEW DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardBuySale;
