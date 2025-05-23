import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utlis/axios';

const PropertyPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/admin/properties', {
                    withCredentials: true
                    // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setProperties(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load properties');
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const handleUpdatePropertyStatus = async (propertyId, status) => {
        try {
            await api.patch(`/admin/properties/${propertyId}/status`, { status }, {
                withCredentials: true
                // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setProperties(properties.map(p => p.id === propertyId ? { ...p, status } : p));
        } catch (err) {
            setError('Failed to update property status');
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await api.delete(`/admin/properties/${propertyId}`, {

                    withCredentials: true
                    // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setProperties(properties.filter(p => p.id !== propertyId));
            } catch (err) {
                setError('Failed to delete property');
            }
        }
    };

    const handleEditProperty = (propertyId) => {
        alert(`Edit property ${propertyId}`); // Placeholder for edit modal
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Properties</h2>
            <table className="w-full">
                <thead>
                    <tr className="text-left border-b">
                        <th className="p-2">Title</th>
                        <th className="p-2">Images</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">City</th>
                        <th className="p-2">Agent</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {properties?.map(property => (
                        <tr key={property.id} className="border-b">
                            <td className="p-2">{property.title}</td>
                            <td className="p-2"><img src={property.images?.[0]} lt="" width={40} height={40} /></td>
                            <td className="p-2">${property.price.toLocaleString()}</td>
                            <td className="p-2">{property.type}</td>
                            <td className="p-2">{property.status}</td>
                            <td className="p-2">{property.city}</td>
                            <td className="p-2">{property.agent?.name || 'N/A'}</td>
                            <td className="p-2">
                                {['FOR_SALE', 'FOR_RENT'].includes(property.status) && (
                                    <button
                                        onClick={() => handleUpdatePropertyStatus(property.id, property.status === 'FOR_SALE' ? 'SOLD' : 'RENTED')}
                                        className="text-green-500 hover:underline mr-2"
                                    >
                                        Mark as {property.status === 'FOR_SALE' ? 'Sold' : 'Rented'}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEditProperty(property.id)}
                                    className="text-blue-500 hover:underline mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProperty(property.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PropertyPage;