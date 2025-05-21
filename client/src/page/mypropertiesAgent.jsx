import { useState, useEffect } from 'react';
import api from '../utlis/axios';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../component/layout/dashboardLayout';
import { PlusCircle, AlertCircle, Search, ArrowUpDown } from 'lucide-react';

const PropertyList = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

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

  const handleCardClick = id => {
    navigate(`/property/${id}`);
  };

  const handleEditProperty = (e, id) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/property/edit/${id}`);
  };

  const handleDeleteProperty = async (e, id) => {
    e.stopPropagation(); // Prevent card click event

    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${id}`);
        setProperties(prev => prev.filter(property => property.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const handleAddProperty = () => {
    navigate('/agent/add-property');
  };

  // Filter properties based on search term
  const filteredProperties = properties.filter(
    property =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    if (sortOrder === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return 0;
  });

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-screen-xl mx-auto p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              My Properties
            </h1>
            <button
              onClick={handleAddProperty}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <PlusCircle size={20} />
              <span>Add Property</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by title, address or city..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <ArrowUpDown size={18} className="text-gray-500" />
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-lg font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : sortedProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                {searchTerm ? (
                  <>
                    <p className="text-xl mb-4">No properties match your search.</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Clear Search
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <PlusCircle size={40} className="text-blue-500" />
                    </div>
                    <p className="text-xl mb-4 font-medium">No properties listed yet.</p>
                    <p className="mb-6 text-center max-w-md">
                      Add your first property to start showcasing your listings to potential
                      clients.
                    </p>
                    <button
                      onClick={handleAddProperty}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Your First Property
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <p className="text-gray-500 mb-6">{sortedProperties.length} properties found</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProperties.map(property => (
                    <PropertyCardWithActions
                      key={property.id}
                      property={property}
                      onClick={() => handleCardClick(property.id)}
                      onEdit={e => handleEditProperty(e, property.id)}
                      onDelete={e => handleDeleteProperty(e, property.id)}
                    />
                  ))}
                </div>
              </>
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
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Property Image */}
      <div className="relative h-52 bg-gray-200 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0] || '/placeholder.svg'}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400">
            <span className="text-sm font-medium">No Image Available</span>
          </div>
        )}
        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
            property.status === 'FOR_SALE'
              ? 'bg-green-500 text-white'
              : property.status === 'FOR_RENT'
                ? 'bg-blue-500 text-white'
                : 'bg-yellow-500 text-white'
          }`}
        >
          {property.status === 'FOR_SALE'
            ? 'For Sale'
            : property.status === 'FOR_RENT'
              ? 'For Rent'
              : 'Sold'}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-3 truncate">
          {property.address}, {property.city}
        </p>

        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-bold text-blue-600">
            ${typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
            {property.status === 'FOR_RENT' && (
              <span className="text-sm font-normal text-gray-500">/month</span>
            )}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="font-semibold mr-1">{property.bedrooms}</span> beds
            </span>{' '}
            •
            <span className="flex items-center">
              <span className="font-semibold mr-1">{property.bathrooms}</span> baths
            </span>{' '}
            •
            <span className="flex items-center">
              <span className="font-semibold mr-1">{property.area}</span> sqft
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
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
