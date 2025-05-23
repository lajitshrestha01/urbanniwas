import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../utlis/axios';
import { Outlet } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
    const [data, setData] = useState({ users: [], properties: [], bookings: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, propertiesRes, bookingsRes] = await Promise.all([
                    api.get('/admin/users', { withCredentials: true }),
                    api.get('/admin/properties', { withCredentials: true, }),
                    api.get('/admin/bookings', { withCredentials: true, }),
                ]);
                setData({
                    users: usersRes.data.data,
                    properties: propertiesRes.data.data,
                    bookings: bookingsRes.data.data,
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };
        console.log(data)
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    // const pieData = {
    //     labels: ['House', 'Apartment', 'Land', 'Commercial'],
    //     datasets: [{
    //         data: [
    //             data.properties.filter(p => p.type === 'HOUSE').length,
    //             data.properties.filter(p => p.type === 'APARTMENT').length,
    //             data.properties.filter(p => p.type === 'LAND').length,
    //             data.properties.filter(p => p.type === 'COMMERCIAL').length,
    //         ],
    //         backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    //         borderColor: ['#1E3A8A', '#065F46', '#B45309', '#991B1B'],
    //         borderWidth: 1,
    //     }],
    // };

    return (
        <div className="space-y-6">
            <Outlet />
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-medium">Total Agents</h3>
                    <p className="text-2xl">{data && data.users && data.users.filter(u => u.role === 'AGENT').length}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-medium">Total Properties</h3>
                    <p className="text-2xl">{data && data.properties && data.properties.length}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-medium">Recent Bookings</h3>
                    <p className="text-2xl">{data && data.bookings && data.bookings.filter(b => new Date(b.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
                </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Property Types</h3>
                <div className="max-w-md mx-auto">
                    {/* <Pie
                        data={pieData}
                        options={{
                            plugins: {
                                title: { display: true, text: 'Properties by Type', font: { size: 18 } },
                                legend: { position: 'bottom' },
                            },
                        }}
                    /> */}
                </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <ul>
                    {data.bookings && data.bookings.slice(0, 5).map(booking => (
                        <li key={booking.id} className="py-2">
                            {booking.user?.name || 'N/A'} booked {booking.property?.title || 'N/A'} on {new Date(booking.date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardPage;
