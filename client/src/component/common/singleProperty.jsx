import React from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utlis/axios';
import { useState, useEffect } from 'react';
import HeroSection from './heroSectionSingleProperty';
import Footer from './footer';
import { Bed, Bath, Ruler } from 'lucide-react'; // Import icons from lucide-react
import Maps from '../map/map';

const SingleProperty = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await api.get(`/properties/${id}`);
                setProperty(response.data);
            } catch (error) {
                setError("Failed to load property!");
                console.error(error);
            }
        };

        fetchProperty();
    }, [id]);

    // Conditional rendering for when property is null
    if (!property) {
        return (
            <div>
                <HeroSection />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <p>Loading property...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="col-span-full lg:col-span-2">
                            <h2 className="text-3xl font-playfair font-bold text-[#1A2B3C] mb-6">
                                {property.price}
                            </h2>
                            <p className="text-lg text-gray-600 font-lato mb-8">
                                {property.description}
                            </p>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="flex items-center space-x-3">
                                    <Bed className="text-[#D4AF37] w-6 h-6" /> {/* Updated icon */}
                                    <span className="text-lg">{property.bedrooms} Beds</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Bath className="text-[#D4AF37] w-6 h-6" /> {/* Updated icon */}
                                    <span className="text-lg">{property.bathrooms} Baths</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Ruler className="text-[#D4AF37] w-6 h-6" /> {/* Updated icon */}
                                    <span className="text-lg">{property.area} Sq.Ft.</span>
                                </div>
                            </div>
                        </div>
                        {<div className="col-span-full lg:col-span-1">
                            <div className="grid grid-cols-2 gap-4">
                                {property.images.slice(0, 2).map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Property view ${index + 1}`}
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </div> }
                    </div>
                </div>
            </div>
            <div className='relative h-[70vh] w-full'>
                <Maps />
            </div>
        </div>
    );
};

export default SingleProperty;