import React from 'react';

const Footer = () => {
  const cities = ['Kathmandu', 'Bhaktapur', 'Lalitpur'];
  const categories = ['House for Sale', 'Land for Sale', 'Apartments for Rent'];
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              Your trusted partner in finding the perfect property in Nepal's major cities.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Cities</h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <a href={`/properties/${city.toLowerCase()}`} className="text-gray-400 hover:text-white">
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <a href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-400 hover:text-white">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: urbanniwas@gmail.com</li>
              <li>Phone: +977 1234567890</li>
              <li>Address: Kathmandu, Nepal</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} UrbanNiwas All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;