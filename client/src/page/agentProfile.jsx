import React, { useState, useRef } from "react";
import useUserStore from "../zustand/store";
import { Phone, Building, User, Mail, MapPin, Save, Edit, X, Upload, Camera } from "lucide-react";
import api from "../utlis/axios";
import DashboardLayout from "../component/layout/dashboardLayout";

export default function AgentProfile() {
  const { user, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    agencyName: user?.agencyName || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "UrbanNiwas");

    try {
      const cloudName = "dpxbzk49v";
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadData,
      });
      
      const data = await response.json();
      
      if (data && data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          avatar: data.secure_url,
        }));
      } else {
        throw new Error("Invalid response from Cloudinary");
      }
    } catch (err) {
      setError("Failed to upload image");
      console.error("Image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("user/update-profile", formData);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear notification messages after 3 seconds
  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Status Messages - Floating notifications */}
          {error && (
            <div className="fixed top-6 right-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 animate-fade-in-down">
              <div className="flex items-center">
                <div className="py-1">
                  <svg className="w-6 h-6 mr-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="fixed top-6 right-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fade-in-down">
              <div className="flex items-center">
                <div className="py-1">
                  <svg className="w-6 h-6 mr-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Success</p>
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header/Banner */}
            <div className="bg-gradient-to-r from-blue-300 to-blue-800 h-32 relative"></div>
            
            {/* Profile Content */}
            <div className="px-6 pb-6">
              {/* Avatar and Edit Button Row */}
              <div className="flex justify-between">
                <div className="relative -mt-16">
                  <img
                    src={isEditing ? formData.avatar : user.avatar || "https://picsum.photos/200/300?grayscale"}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        disabled={isUploading}
                        className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                      >
                        {isUploading ? (
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <Camera size={18} />
                        )}
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`mt-4 flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                    isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2" size={16} /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2" size={16} /> Edit Profile
                    </>
                  )}
                </button>
              </div>
              
              {/* Profile Content */}
              <div className="mt-4">
                {isEditing ? (
                  /* Edit Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Your email"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Agency Name</label>
                        <input
                          type="text"
                          name="agencyName"
                          value={formData.agencyName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Your agency"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Tell clients about yourself"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2" size={16} /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Profile View */
                  <>
                    <div className="border-b border-gray-200 pb-4">
                      <h2 className="text-2xl font-bold text-gray-800">{user.name || "Agent Name"}</h2>
                      <p className="text-blue-600 font-medium flex items-center mt-1">
                        <User className="mr-2 text-blue-600" size={18} /> {user.role || "Real Estate Agent"}
                      </p>
                      {user.agencyName && (
                        <p className="text-gray-600 flex items-center mt-1">
                          <Building className="mr-2 text-gray-500" size={18} /> {user.agencyName}
                        </p>
                      )}
                    </div>

                    {/* Agent Information Cards */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <Phone className="mr-2 text-blue-600" size={18} /> Contact Information
                        </h3>
                        
                        <div className="space-y-3">
                          {user.phoneNumber && (
                            <div className="flex items-start">
                              <div className="bg-blue-100 p-2 rounded-md mr-3">
                                <Phone className="text-blue-600" size={16} />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-800">{user.phoneNumber}</p>
                              </div>
                            </div>
                          )}
                          
                          {user.email && (
                            <div className="flex items-start">
                              <div className="bg-blue-100 p-2 rounded-md mr-3">
                                <Mail className="text-blue-600" size={16} />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-800">{user.email}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <User className="mr-2 text-blue-600" size={18} /> About Me
                        </h3>
                        
                        <p className="text-gray-700 leading-relaxed">
                          {user.bio || "No bio available. Edit your profile to add information about yourself and your real estate expertise."}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          
        </div>
      </div>
    </DashboardLayout>
  );
}