import React, { useState, useEffect } from 'react';
import api from '../utlis/axios';
import PropertyCard from '../component/common/propertyCard';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../component/layout/dashboardLayout';
import { PlusCircle, AlertCircle } from 'lucide-react';

const PropertyList = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties on mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      const fetchProperties = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/properties?agentId=${loggedInUser.id}`);
          setProperties(response.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching properties:', error);
          setError('Failed to load properties. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProperties();
    } else {
      setIsLoading(false);
      setError('You must be logged in to view properties.');
    }
  }, []);

  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleEditProperty = (e, id) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/property/${id}`);
  };

  const handleDeleteProperty = async (e, id) => {
    e.stopPropagation(); // Prevent card click event
    
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${id}`);
        setProperties((prev) => prev.filter(property => property.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const handleAddProperty = () => {
    navigate('/agent/add-property');
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
            <button
              onClick={handleAddProperty}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusCircle size={20} />
              <span>Add Property</span>
            </button>
          </div>
          
          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p>{error}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-xl mb-4">No properties listed yet.</p>
                <p>Click the "Add Property" button to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCardWithActions
                    key={property.id}
                    property={property}
                    onClick={() => handleCardClick(property.id)}
                    onEdit={(e) => handleEditProperty(e, property.id)}
                    onDelete={(e) => handleDeleteProperty(e, property.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Enhanced PropertyCard with action buttons
const PropertyCardWithActions = ({ property, onClick, onEdit, onDelete }) => {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
            No Image Available
          </div>
        )}
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
          property.status === 'FOR_SALE' ? 'bg-green-500 text-white' : 
          property.status === 'FOR_RENT' ? 'bg-blue-500 text-white' : 
          'bg-yellow-500 text-white'
        }`}>
          {property.status === 'FOR_SALE' ? 'For Sale' : 
           property.status === 'FOR_RENT' ? 'For Rent' : 'Sold'}
        </div>
      </div>
      
      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{property.title}</h3>
        <p className="text-gray-600 mb-2 truncate">{property.address}, {property.city}</p>
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-bold text-blue-600">
            ${typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{property.bedrooms} beds</span> • 
            <span>{property.bathrooms} baths</span> • 
            <span>{property.area} sqft</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;