import React from 'react';
import PropertySection from '../common/propertysection.jsx';
import { DUMMY_PROPERTIES } from '../../utlis/constants.js';

const ExclusiveProperties = () => {
  return (
    <PropertySection 
      title="Exclusive Properties"
      properties={DUMMY_PROPERTIES.exclusive}
      viewAllLink="/properties/exclusive"
    />
  );
};

export default ExclusiveProperties;