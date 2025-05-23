import React, { useEffect, useState } from 'react';
import PropertySection from '../common/propertysection.jsx';
import api from '../../utlis/axios.js';

const ExclusiveProperties = () => {
  const [exclusiveProperties, setExclusiveProperties] = useState([]);
  useEffect(() => {
    const fetchExclusive = async () => {
      try {
        const res = await api.get('/filter/filter-properties');
        const exclusive = [...res.data.exclusiveSale, ...res.data.exclusiveRent].slice(0, 4);
        setExclusiveProperties(exclusive);
      } catch (error) {
        console.error('failed to fetch exlcusive properties', error);
      }
    };
    fetchExclusive();
  }, []);
  return (
    <PropertySection
      title="Exclusive Properties"
      properties={exclusiveProperties}
      viewAllLink="/properties/exclusive"
    />
  );
};

export default ExclusiveProperties;
