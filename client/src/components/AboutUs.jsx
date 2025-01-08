import React from 'react';
import logo from '../assets/logo.jpg';

const About = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">About UrbanNiwas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
          <img src={logo} alt="UrbanNiwas Image" className="w-full max-w-md rounded-lg shadow-lg" />
          </div>
          <div>
            <p className="text-lg text-gray-700 mb-4">
              At UrbanNiwas, we specialize in connecting you with the best real estate properties in Nepal. Whether you're looking to buy, sell, or rent residential or commercial spaces, UrbanNiwas offers a user-friendly platform to make your real estate journey seamless and efficient.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our diverse listings include properties from individual owners, agents, and agencies, ensuring a wide range of options. UrbanNiwas is your trusted partner in navigating the dynamic real estate market in Nepal, offering personalized support for both buyers and sellers.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              At UrbanNiwas, we are committed to making real estate transactions transparent, secure, and hassle-free for everyone involved. Join us today and experience how we are revolutionizing the real estate market in Nepal!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
