import { useState } from 'react';
import api from '../../utlis/axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../component/layout/dashboardLayout';

const AddPropertyForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
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

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Form input handler
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add feature to formData.features
  const handleFeatureChange = e => {
    const { name, checked } = e.target;
    setFeature(prev => ({
      ...prev,
      [name]: checked,
    }));

    if (checked) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, name],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter(feature => feature !== name),
      }));
    }
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async e => {
    const files = Array.from(e.target.files);
    const cloudName = 'dpxbzk49v';
    const maxImages = 6;
    const remainingSlots = maxImages - formData.images.length;

    if (remainingSlots <= 0) {
      showNotification(`You can upload a maximum of ${maxImages} images.`, 'error');
      return;
    }

    if (files.length > remainingSlots) {
      showNotification(
        `Only uploading the first ${remainingSlots} images. Maximum is ${maxImages}.`,
        'warning'
      );
    }

    try {
      setIsSubmitting(true);
      const filesToUpload = files.slice(0, remainingSlots);

      const uploadPromises = filesToUpload.map(async file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'UrbanNiwas');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(`Upload failed: ${data.error?.message || 'Unknown error'}`);
        return data.secure_url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
      showNotification(`Successfully uploaded ${imageUrls.length} images`, 'success');
    } catch (error) {
      console.error('Error uploading images:', error);
      showNotification('Failed to upload images. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = index => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    showNotification('Image removed', 'success');
  };

  // Validate form before submission
  const validateForm = () => {
    const requiredFields = ['title', 'description', 'price', 'type', 'status', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return false;
    }

    if (formData.images.length === 0) {
      showNotification('Please upload at least one image', 'error');
      return false;
    }

    return true;
  };

  // Submit new property
  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      showNotification('You must be logged in to post a property.', 'error');
      return;
    }

    const propertyData = {
      ...formData,
      price: Number.parseFloat(formData.price) || 0,
      area: Number.parseFloat(formData.area) || 0,
      bedrooms: Number.parseInt(formData.bedrooms) || 0,
      bathrooms: Number.parseInt(formData.bathrooms) || 0,
      latitude: Number.parseFloat(formData.latitude) || 0,
      longitude: Number.parseFloat(formData.longitude) || 0,
      agentId: loggedInUser.id,
    };

    try {
      setIsSubmitting(true);
      const response = await api.post('/properties', propertyData);
      setProperties(prev => [...prev, response.data]);
      showNotification('Property added successfully!', 'success');
      navigate('/agent/properties');
    } catch (error) {
      console.error('Error adding property:', error);
      showNotification(
        error.response?.data?.message || 'Failed to add property. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
              : notification.type === 'error'
                ? 'bg-red-100 text-red-800 border-l-4 border-red-500'
                : 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="min-h-screen bg-white text-black p-5">
        <div className="max-w-7xl p-6 mx-auto bg-gray-50 rounded-xl shadow-sm">
          <div className="mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800">Add New Property</h1>
            <p className="text-gray-600">Fill in the details below to list a new property</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter property title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the property"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g. 750000"
                        className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                      required
                    >
                      <option value="FOR_SALE">For Sale</option>
                      <option value="FOR_RENT">For Rent</option>
                      <option value="SOLD">Sold</option>
                      <option value="RENTED">Rented</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Area (sqft)</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                    required
                  >
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="LAND">Land</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="Latitude"
                      step="0.000001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="Longitude"
                      step="0.000001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Property Features
                  </label>
                  <p className="text-gray-500 text-sm">
                    Select all the features that apply to this property
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="parking"
                        name="parking"
                        checked={feature.parking}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="parking" className="text-gray-700">
                        Parking
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="swimmingPool"
                        name="swimmingPool"
                        checked={feature.swimmingPool}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="swimmingPool" className="text-gray-700">
                        Swimming Pool
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="gym"
                        name="gym"
                        checked={feature.gym}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="gym" className="text-gray-700">
                        Gym
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="security"
                        name="security"
                        checked={feature.security}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="security" className="text-gray-700">
                        24/7 Security
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="airConditioning"
                        name="airConditioning"
                        checked={feature.airConditioning}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="airConditioning" className="text-gray-700">
                        Air Conditioning
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="balcony"
                        name="balcony"
                        checked={feature.balcony}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="balcony" className="text-gray-700">
                        Balcony
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="garden"
                        name="garden"
                        checked={feature.garden}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="garden" className="text-gray-700">
                        Garden
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="furnished"
                        name="furnished"
                        checked={feature.furnished}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="furnished" className="text-gray-700">
                        Furnished
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="unfurnished"
                        name="unfurnished"
                        checked={feature.unfurnished}
                        onChange={handleFeatureChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="unfurnished" className="text-gray-700">
                        Unfurnished
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Images Section */}
            <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-white">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Property Images</h2>
                <p className="text-gray-500 text-sm">
                  Upload high-quality images of your property (max 6 images)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <label
                  className={`flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                    ></path>
                  </svg>
                  Upload Image
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isSubmitting || formData.images.length >= 6}
                  />
                </label>
                <span className="text-sm text-gray-500">
                  {formData.images.length}/6 images uploaded
                </span>
              </div>

              {/* Display Image Previews */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img || '/placeholder.svg'}
                      alt={`Property Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg shadow-sm"
                    />
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-white text-gray-700 hover:text-red-600 rounded-full p-1 m-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 6 - formData.images.length) }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center"
                  >
                    <span className="text-gray-400 text-sm">Empty slot</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 mb-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Create Property'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddPropertyForm;
