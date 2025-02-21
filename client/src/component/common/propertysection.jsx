import React from 'react';
import PropertyCard from './propertyCard.jsx';

const PropertySection = ({ title, properties, viewAllLink }) => {
  return (
    <div className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <a 
            href={viewAllLink} 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertySection;