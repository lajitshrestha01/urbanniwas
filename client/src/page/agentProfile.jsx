import React, { useState, useRef } from "react";
import useUserStore from "../zustand/store";
import Navbar from "../component/common/navbar";
import { Phone, Building, User, MapPin, Save, Edit, X, Upload } from "lucide-react";
import api from "../utlis/axios";

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
    uploadData.append("upload_preset", "UrbanNiwas"); // Replace with your upload preset

    try {
      const cloudName = "dpxbzk49v";
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadData,
      });
      
      // Parse the JSON response correctly
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
      console.log("api response:", response.data);
      
      if (response.data && response.data.user) {
        //using seUser method form zustand storre to update state and local storage.
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

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        {/* Profile Header with Edit Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Agent Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center px-4 py-2 rounded-lg text-white ${
              isEditing ? "bg-red-500" : "bg-blue-600"
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

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={formData.avatar || "https://picsum.photos/200/300?grayscale"}
                    alt="User Avatar"
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-300"
                  />
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
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full"
                  >
                    {isUploading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Upload size={14} />
                    )}
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold">Profile Picture</h3>
                  <p className="text-sm text-gray-500">Click the icon to upload a new profile picture</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your email"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Agency Name</label>
                <input
                  type="text"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your agency"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell clients about yourself"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center disabled:bg-gray-400"
              >
                {isLoading ? "Saving..." : (
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
            <div className="flex items-center space-x-6 border-b pb-6">
              <img
                src={user.avatar || "https://picsum.photos/200/300?grayscale"}
                alt="User Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-300"
              />
              <div>
                <h2 className="text-3xl font-bold">{user.name || "Agent Name"}</h2>
                <p className="text-gray-500 flex items-center">
                  <User className="mr-2 text-gray-400" /> {user.role}
                </p>
                <p className="text-gray-500 flex items-center">
                  <Building className="mr-2 text-gray-400" /> {user.agencyName || "No Agency Listed"}
                </p>
              </div>
            </div>

            {/* Agent Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">Contact Information</h3>
                <p className="text-gray-600 flex items-center mt-2">
                  <Phone className="mr-2 text-gray-500" /> {user.phoneNumber || "No Phone Available"}
                </p>

                {user.email && (
                  <p className="text-gray-600 flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email}
                  </p>
                )}
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">Agent Bio</h3>
                <p className="text-gray-600 mt-2">{user.bio || "No bio available."}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}