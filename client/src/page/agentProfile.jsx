import React from "react";
import useUserStore from "../zustand/store";
import Navbar from "../component/common/navbar";
import { Phone, Building, User, MapPin } from "lucide-react";

export default function AgentProfile() {
  const { user } = useUserStore();

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        {/* Profile Header */}
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
            <p className="text-gray-600 flex items-center mt-2">
              <MapPin className="mr-2 text-gray-500" /> {user.serviceAreas?.join(", ") || "No Service Areas"}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Agent Bio</h3>
            <p className="text-gray-600 mt-2">{user.bio || "No bio available."}</p>
          </div>
        </div>
      </div>
    </>
  );
}
