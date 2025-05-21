import React from 'react';
import MainLayout from '../component/layout/mainLayout.jsx';
import Hero from '../component/home/Hero.jsx';
import ExclusiveProperties from '../component/home/exclusiveProperties.jsx';
import PremiumProperties from '../component/home/premiumProperties.jsx';
import RecentProperties from '../component/home/recentproperties.jsx';

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      <div className="container mx-auto px-4">
        <ExclusiveProperties />
        <PremiumProperties />
        <RecentProperties />
      </div>
    </MainLayout>
  );
};

export default Home;
