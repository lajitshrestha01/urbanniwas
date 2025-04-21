import React from 'react';

const Footer = () => {
  const cities = ['Kathmandu', 'Bhaktapur', 'Lalitpur'];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About Us</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner in finding the perfect property across Nepal's major cities.
            </p>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Cities</h3>
            <ul className="space-y-1">
              {cities.map((city) => (
                <li key={city}>
                  <a
                    href={`/properties/city/${city.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>Email: <a href="mailto:urbanniwas@gmail.com" className="hover:text-white">urbanniwas@gmail.com</a></li>
              <li>Phone: <a href="tel:+9771234567890" className="hover:text-white">+977 1234567890</a></li>
              <li>Address: Kathmandu, Nepal</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-5 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} UrbanNiwas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
