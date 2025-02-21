import React from 'react';
import PropertySection from '../common/propertysection';
import { DUMMY_PROPERTIES } from '../../utlis/constants.js';

const RecentProperties = () => {
  return (
    <PropertySection 
      title="Recent Properties"
      properties={DUMMY_PROPERTIES.recent}
      viewAllLink="/properties/recent"
    />
  );
};

export default RecentProperties;