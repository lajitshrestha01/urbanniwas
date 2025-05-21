import React, { Children } from 'react';
import Navbar from '../common/navbar';
import Footer from '../common/footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
