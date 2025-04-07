import React, { useState, useEffect } from 'react';
import api from '../../utlis/axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../component/layout/dashboardLayout';

const AddPropertyForm = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
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
  const [feature, setFeature] = useState({
    parking: false,
    gym: false,
    airConditioning: false,
    balcony: false,
    swimmingPool: false,
    garden: false,
    security: false,
    furnished: false,
    unfurnished: false,

  });

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add feature to formData.features
  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setFeature((prev) => ({
      ...prev,
      [name]: checked,
    }));

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, name],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.filter((feature) => feature !== name),
      }));
    }


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

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
    <DashboardLayout>
      <div className="min-h-screen bg-white text-black p-5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Add New Property</h1>
            <p className="text-gray-800">Fill in the details below to list a new property</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter property title"
                    className="w-full px-4 py-3  border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the property"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g. 750000"
                      className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Select status</option>
                      <option value="FOR_SALE">For Sale</option>
                      <option value="FOR_RENT">For Rent</option>
                      <option value="SOLD">Sold</option>
                      <option value="RENTED">Rented</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Area (sqft)</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Property Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select type</option>
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="LAND">Land</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="latitude"
                      className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="longitude"
                      className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">Property Features</label>
                  <p className="text-gray-400 text-sm">Select all the features that apply to this property</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="parking"
                        name="parking"
                        checked={setFeature.parking}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="parking">Parking</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="swimmingPool"
                        name="swimmingPool"
                        checked={setFeature.swimmingPool}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="swimmingPool">Swimming Pool</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="gym"
                        name="gym"
                        checked={setFeature.gym}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="gym">Gym</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="security"
                        name="security"
                        checked={setFeature.security}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="security">24/7 Security</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="airConditioning"
                        name="airConditioning"
                        checked={setFeature.airConditioning}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="airConditioning">Air Conditioning</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="balcony"
                        name="balcony"
                        checked={setFeature.balcony}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="balcony">Balcony</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="furnished"
                        name="furnished"
                        checked={setFeature.furnished}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="furnished">Furnished</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="unfurnished"
                        name="unfurnished"
                        checked={setFeature.unfurnished}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="unfurnished">Unfurnished</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Images Section */}
            <div className="mt-8 p-6 border border-gray-700 rounded-lg">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Property Images</h2>
                <p className="text-gray-400 text-sm">Upload high-quality images of your property (max 6 images)</p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 bg-transparent border border-gray-600 rounded-md cursor-pointer hover:bg-gray-900 transition">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                  </svg>
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Display Image Previews */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Property Image ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg shadow-sm"
                    />
                    {/* Remove Button */}
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-gray-800 text-white text-sm rounded-full p-1 m-1 hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>


            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-transparent border border-gray-600 text-black rounded-md hover:text-red-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-transparent border-gray-600 text-black font-medium rounded-md hover:bg-green-600 transition"
              >
                Create Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddPropertyForm;