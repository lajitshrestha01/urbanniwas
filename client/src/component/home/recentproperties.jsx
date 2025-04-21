import React, { useEffect, useState } from 'react';
import PropertySection from '../common/propertysection';
import api from '../../utlis/axios';

const RecentProperties = () => {
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/filter/filter-properties');
        setRecentProperties(res.data.recent.slice(0, 4)); // Get top 4 recent properties
      } catch (error) {
        console.error('Failed to fetch recent properties:', error);
      }
    };

    fetchRecent();
  }, []);

  return (
    <PropertySection 
      title="Recent Properties"
      properties={recentProperties}
      viewAllLink="/properties/recent"
    />
  );
};

export default RecentProperties;
