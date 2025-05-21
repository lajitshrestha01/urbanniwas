import React, { useEffect, useState } from 'react';
import PropertySection from '../common/propertysection.jsx';
import api from '../../utlis/axios.js';

const PremiumProperties = () => {
  const [premiumProperties, setPremiumProperties] = useState([]);
  useEffect(() => {
    const fetchPremium = async () => {
      try {
        const res = await api.get('/filter/filter-properties');
        const premium = [...res.data.premiumSale, ...res.data.premiumRent].slice(0, 4);
        setPremiumProperties(premium);
      } catch (error) {
        console.error('failed to fetch exlcusive properties', error);
      }
    };
    fetchPremium();
  });
  return (
    <PropertySection
      title="Premium Properties"
      properties={premiumProperties}
      viewAllLink="/properties/premium"
    />
  );
};

export default PremiumProperties;
