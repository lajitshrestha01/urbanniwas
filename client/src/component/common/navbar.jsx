import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../zustand/store.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Extract user, isAuthenticated, and logoutUser from Zustand store
  const { user, isAuthenticated, logoutUser } = useUserStore();
  const role = user?.role;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => {  
    logoutUser(); // Call Zustand logoutUser function
    navigate('/'); // Redirect to home
  };

  return (
    <nav className="bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side: Logo & Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <span className="ml-2 text-xl font-bold text-indigo-600">UrbanNiwas</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
              <Link to="/" className="text-gray-500 hover:text-indigo-700 px-1 pt-1 text-sm font-medium">Home</Link>
              <Link to="/buy" className="text-gray-500 hover:text-indigo-700 px-1 pt-1 text-sm font-medium">Buy</Link>
              <Link to="/rent" className="text-gray-500 hover:text-indigo-700 px-1 pt-1 text-sm font-medium">Rent</Link>
            </div>
          </div>

          {/* Right Side: Profile & Logout */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <button onClick={toggleProfileMenu} className="flex items-center text-sm focus:outline-none">
                  <img className="h-8 w-8 rounded-full" src={user.profileImage || 'https://picsum.photos/200/300?grayscale'} alt={user.name} />
                  <span className="ml-2 text-gray-700">{user.name}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white">
                    {role === "AGENT" && (
                      <>
                        <Link to="/agent/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                        <Link to="/agent/properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Properties</Link>
                      </>
                    )}
                    {role === "CLIENT" && (
                      <>
                        <Link to="/client/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                        <Link to="/client/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Favorites</Link>
                        <Link to="/client/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Messages</Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="ml-8 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Sign in</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
