import React from 'react';
import PropertySection from '../common/propertysection';
import { DUMMY_PROPERTIES } from '../../utlis/constants.js';

const PremiumProperties = () => {
  return (
    <PropertySection 
      title="Premium Properties"
      properties={DUMMY_PROPERTIES.premium}
      viewAllLink="/properties/premium"
    />
  );
};

export default PremiumProperties;