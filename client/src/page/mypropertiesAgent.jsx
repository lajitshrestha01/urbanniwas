import React, { useState, useEffect } from 'react';
import api from '../utlis/axios'; // Assuming this is your Axios instance
import Navbar from '../component/common/navbar';
import PropertyCard from '../component/common/propertyCard';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const PropertyList = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [step, setStep] = useState(1); // Unused in this snippet, possibly for multi-step form?
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'HOUSE',
    status: 'FOR_SALE',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    city: '',
    features: [],
    images: [],
    latitude: '',
    longitude: '',
  });
  const [feature, setFeature] = useState('');

  // Fetch properties on mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      const fetchProperties = async () => {
        try {
          const response = await api.get(`/properties?agentId=${loggedInUser.id}`);
          setProperties(response.data);
        } catch (error) {
          console.error('Error fetching properties:', error);
        }
      };
      fetchProperties();
    }
  }, []);

  // Handle navigation to single property view
  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add feature to formData.features
  const handleFeatureAdd = () => {
    if (feature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature.trim()],
      }));
      setFeature('');
    }
  };

  // Remove feature from formData.features
  const handleFeatureRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const cloudName = 'dpxbzk49v';

    try {
      setFormData((prev) => {
        if (prev.images.length + files.length > 6) {
          alert('You can upload a maximum of 6 images.');
          return prev;
        }
        return prev;
      });

      const uploadPromises = files.slice(0, 6 - formData.images.length).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'UrbanNiwas');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(`Upload failed: ${data.error?.message || 'Unknown error'}`);
        return data.secure_url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls].slice(0, 6),
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    }
  };

  // Submit new property
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      alert('You must be logged in to post a property.');
      return;
    }

    const propertyData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      area: parseFloat(formData.area) || 0,
      bedrooms: parseFloat(formData.bedrooms) || 0,
      bathrooms: parseFloat(formData.bathrooms) || 0,
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0,
      agentId: loggedInUser.id,
    };

    try {
      const response = await api.post('/properties', propertyData);
      setProperties((prev) => [...prev, response.data]);
      setFormData({
        title: '',
        description: '',
        price: '',
        type: 'HOUSE',
        status: 'FOR_SALE',
        bedrooms: '',
        bathrooms: '',
        area: '',
        address: '',
        city: '',
        features: [],
        images: [],
        latitude: '',
        longitude: '',
      });
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Properties List - Left Side */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Properties</h2>
              {properties.length === 0 ? (
                <p className="text-gray-500 text-center">No properties listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      property={property}
                      key={property._id} // Changed to _id (MongoDB convention)
                      onClick={() => handleCardClick(property.id)} // Fixed prop name
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Property Form - Right Side */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Property</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    name="title"
                    placeholder="Property Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="LAND">Land</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="FOR_SALE">For Sale</option>
                    <option value="FOR_RENT">For Rent</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <input
                    name="area"
                    type="number"
                    placeholder="Area (sq ft)"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="latitude"
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <input
                    name="longitude"
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {formData.type !== 'LAND' && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="bedrooms"
                      type="number"
                      placeholder="Bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <input
                      name="bathrooms"
                      type="number"
                      placeholder="Bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <textarea
                  name="description"
                  placeholder="Property Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  rows={4}
                />

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      placeholder="Add feature (e.g., Pool)"
                      value={feature}
                      onChange={(e) => setFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleFeatureAdd();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleFeatureAdd}
                      className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feat, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {feat}
                        <button
                          type="button"
                          onClick={() => handleFeatureRemove(index)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block w-full">
                    <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all duration-200 bg-gray-50">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                      <span className="text-gray-500 text-sm">Click to upload images (max 6)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Property ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-md"
                >
                  Add Property
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;