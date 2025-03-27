import React from "react"

export const Component = () => {
    return (
        <div id="webcrumbs">
            <div className="w-[1200px] font-sans bg-white">
                {/* Hero Section */}
                <div className="relative w-full h-[500px] mb-12 overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&h=500&q=80"
                        alt="Luxury Property"
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-navy-900 bg-opacity-40 flex items-end p-10">
                        <div className="text-white transition-transform duration-500 ease-in-out transform group-hover:translate-y-[-10px]">
                            <h1 className="font-['Playfair_Display'] text-5xl font-bold mb-2 leading-tight">
                                Coastal Elegance Villa
                            </h1>
                            <p className="font-['Lato'] text-xl">Palm Beach, Florida</p>
                        </div>
                    </div>
                </div>

                {/* Property Details Section */}
                <div className="w-full px-8 mb-16">
                    <h2 className="font-['Playfair_Display'] text-3xl text-navy-900 font-bold mb-8 border-b-2 border-gold-500 pb-2 inline-block">
                        Property Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Price Card */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-navy-800 text-white p-4">
                                <h3 className="font-['Playfair_Display'] text-xl font-semibold">Price</h3>
                            </div>
                            <div className="p-6">
                                <p className="font-['Lato'] text-3xl font-bold text-navy-900">$4,750,000</p>
                                <p className="text-gray-500 mt-2">Premium Listing</p>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-navy-800 text-white p-4">
                                <h3 className="font-['Playfair_Display'] text-xl font-semibold">Features</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-gold-500 mr-2">bed</span>
                                        <p className="font-['Lato']">
                                            <span className="font-bold">5</span> Bedrooms
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-gold-500 mr-2">shower</span>
                                        <p className="font-['Lato']">
                                            <span className="font-bold">6</span> Bathrooms
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-gold-500 mr-2">straighten</span>
                                        <p className="font-['Lato']">
                                            <span className="font-bold">6,200</span> sq ft
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-gold-500 mr-2">garage</span>
                                        <p className="font-['Lato']">
                                            <span className="font-bold">3</span> Garages
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-navy-800 text-white p-4">
                                <h3 className="font-['Playfair_Display'] text-xl font-semibold">Location</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start">
                                    <span className="material-symbols-outlined text-gold-500 mr-2 mt-1">
                                        location_on
                                    </span>
                                    <div>
                                        <p className="font-['Lato'] font-bold">Palm Beach</p>
                                        <p className="font-['Lato'] text-gray-600">123 Ocean Drive</p>
                                        <p className="font-['Lato'] text-gray-600">Florida, 33480</p>
                                    </div>
                                </div>
                                <button className="mt-4 flex items-center text-navy-800 font-semibold hover:text-gold-500 transition-colors duration-300">
                                    <span className="material-symbols-outlined mr-1">directions</span>
                                    Get directions
                                </button>
                            </div>
                        </div>
                        {/* Next: "Add additional cards for amenities, year built, and property type" */}
                    </div>
                </div>

                {/* Interactive Map Section */}
                <div className="w-full px-8 mb-16">
                    <h2 className="font-['Playfair_Display'] text-3xl text-navy-900 font-bold mb-8 border-b-2 border-gold-500 pb-2 inline-block">
                        Location
                    </h2>

                    <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
                        {/* Map Container */}
                        <div className="w-full h-full bg-gray-100 relative">
                            {/* Simulated Map Image */}
                            <img
                                src="https://maps.googleapis.com/maps/api/staticmap?center=Palm+Beach,Florida&zoom=14&size=1200x400&markers=color:red%7CPalm+Beach,Florida&key=YOUR_API_KEY"
                                alt="Property Location Map"
                                className="w-full h-full object-cover"
                            />

                            {/* Grid Overlay */}
                            <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
                                {Array(32)
                                    .fill()
                                    .map((_, i) => (
                                        <div
                                            key={i}
                                            className="border border-white border-opacity-20 hover:bg-gold-500 hover:bg-opacity-10 transition-colors duration-300"
                                        ></div>
                                    ))}
                            </div>

                            {/* Map Controls */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                                <button className="bg-white w-10 h-10 rounded-md shadow-md flex items-center justify-center hover:bg-navy-800 hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                                <button className="bg-white w-10 h-10 rounded-md shadow-md flex items-center justify-center hover:bg-navy-800 hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">remove</span>
                                </button>
                            </div>

                            {/* Location Pin - Central Point */}
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 group">
                                <span className="material-symbols-outlined text-4xl text-red-600 animate-bounce">
                                    location_on
                                </span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                                    <p className="font-['Lato'] text-sm font-semibold">123 Ocean Drive</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Legend */}
                        <div className="absolute bottom-4 left-4 bg-white py-2 px-4 rounded-md shadow-md">
                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-red-600 mr-2">location_on</span>
                                <span className="font-['Lato'] text-sm">Property Location</span>
                            </div>
                        </div>
                    </div>
                    {/* Next: "Add a toggle for satellite/street view and nearby points of interest" */}
                </div>

                {/* Property Description Section */}
                <div className="w-full px-8 mb-16">
                    <h2 className="font-['Playfair_Display'] text-3xl text-navy-900 font-bold mb-8 border-b-2 border-gold-500 pb-2 inline-block">
                        About This Property
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <p className="font-['Lato'] text-lg leading-relaxed mb-6">
                                Welcome to this breathtaking oceanfront property, where luxury meets coastal elegance.
                                This magnificent villa offers unparalleled views of the Atlantic Ocean with direct beach
                                access.
                            </p>
                            <p className="font-['Lato'] text-lg leading-relaxed mb-6">
                                Featuring 5 lavish bedrooms, 6 designer bathrooms, and over 6,200 square feet of living
                                space, this estate exemplifies modern luxury living. The open floor plan seamlessly
                                connects indoor and outdoor spaces, perfect for entertaining.
                            </p>
                            <p className="font-['Lato'] text-lg leading-relaxed">
                                The property includes a infinity pool, spa, outdoor kitchen, and lush landscaped
                                gardens. Only minutes away from world-class dining, shopping, and golf courses.
                            </p>

                            <div className="mt-8 flex space-x-4">
                                <button className="bg-navy-800 text-white px-6 py-3 rounded-md hover:bg-navy-700 transition-colors duration-300 flex items-center">
                                    <span className="material-symbols-outlined mr-2">calendar_month</span>
                                    Schedule a Tour
                                </button>
                                <button className="border border-navy-800 text-navy-800 px-6 py-3 rounded-md hover:bg-navy-50 transition-colors duration-300 flex items-center">
                                    <span className="material-symbols-outlined mr-2">contact_page</span>
                                    Contact Agent
                                </button>
                            </div>
                        </div>

                        <div className="bg-navy-50 p-6 rounded-lg">
                            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-4 text-navy-900">
                                Property Highlights
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-gold-500 mr-2 mt-1">
                                        check_circle
                                    </span>
                                    <span className="font-['Lato']">Oceanfront with private beach access</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-gold-500 mr-2 mt-1">
                                        check_circle
                                    </span>
                                    <span className="font-['Lato']">Infinity pool and spa</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-gold-500 mr-2 mt-1">
                                        check_circle
                                    </span>
                                    <span className="font-['Lato']">Smart home automation system</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-gold-500 mr-2 mt-1">
                                        check_circle
                                    </span>
                                    <span className="font-['Lato']">Chef's kitchen with premium appliances</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-gold-500 mr-2 mt-1">
                                        check_circle
                                    </span>
                                    <span className="font-['Lato']">Wine cellar and tasting room</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-gold-500 mr-2 mt-1">
                                        check_circle
                                    </span>
                                    <span className="font-['Lato']">Home theater and entertainment space</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-gold-500 mr-2 mt-1">
                                        check_circle
                                    </span>
                                    <span className="font-['Lato']">3-car climate-controlled garage</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Next: "Add property gallery with thumbnail navigation and full-screen view option" */}
                </div>
            </div>
        </div>
    )
}
