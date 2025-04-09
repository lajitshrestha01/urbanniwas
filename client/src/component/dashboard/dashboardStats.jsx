import React, { useEffect, useState } from 'react';
import useUserStore from '../../zustand/store';
import api from '../../utlis/axios';
import PropertyCard from '../common/propertyCard';
import { BarChart3, DollarSign, Clock, ListOrdered, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const DashboardStats = () => {
  const { user } = useUserStore();
  const agentId = user?.id;

  const navigate = useNavigate();

  const [dataForDashboard, setDataForDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    if (!agentId) return;

    const fetchData = async () => {
      try {
        const response = await api.get(`/agent/dashboard/${agentId}`);
        setDataForDashboard(response.data);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId]);

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading dashboard...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  const {
    totalProperties,
    totalValueOfProperty,
    pendingSales,
    recentProperties
  } = dataForDashboard;

  const stats = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: <ListOrdered className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: 'Total Value',
      value: `₹${totalValueOfProperty.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
    },
    {
      title: 'Pending Sales',
      value: pendingSales,
      icon: <Clock className="w-8 h-8 text-yellow-500" />,
    },
  ];

  return (
    <section className="px-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <StatCard key={idx} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Recent Properties & Add New Property Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recent Properties</h2>
        <button
          className="flex items-center text-white bg-blue-600 hover:bg-indigo-700 p-3 rounded-full cursor-pointer shadow-md transition duration-300"
          onClick={() => navigate('/agent/add-property')} 
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Property
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        {recentProperties.slice(0, 3).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
    <div>
      <h4 className="text-sm font-semibold text-gray-500 mb-1">{title}</h4>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <div className="bg-gray-100 p-3 rounded-full">
      {icon}
    </div>
  </div>
);

export default DashboardStats;
