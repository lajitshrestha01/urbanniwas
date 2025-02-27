import React from 'react'
import useUserStore from '../zustand/store'
import Navbar from '../component/common/navbar';

export default function AgentProfile() {
    const { user } = useUserStore();
    return (
        <>
        <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
                <div className="flex items-center space-x-6">
                    <img
                        src={user.avatar || 'https://picsum.photos/200/300?grayscale'}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-2xl font-semibold">{user.email}</h2>
                        <p className="text-gray-500">{user.role}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold">My Properties</h3>
                    <div className="mt-4 space-y-4">
                        {/* {user.properties.length > 0 ? (
                        user.properties.map((property) => (
                            <div key={property.id} className="border p-4 rounded-md">
                                <h4 className="text-lg font-semibold">{property.title}</h4>
                                <p className="text-gray-600">{property.description}</p>
                                <p className="text-gray-500">{property.status}</p>
                                <p className="text-gray-500">{property.price}</p>
                                <a
                                    href={`/properties/${property.id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                View Details
                                </a>
                            </div>
                        ))
                        ) : ( */}
                        <p className="text-gray-500">You have no properties listed.</p>
                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    );
};

