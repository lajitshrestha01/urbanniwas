import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../zustand/store';

const Header = () => {
  const { user, logoutUser } = useUserStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Example state for notification badge
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => {
    logoutUser(); // Call Zustand logoutUser function
    navigate('/'); // Redirect to home
  };

  return (
    <header className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
      {/* Empty div for spacing on the left side */}
      <div className="w-8 lg:hidden"></div>

      {/* Notification and Profile Section on the Right */}
      <div className="flex items-center space-x-5 ml-auto">
        {/* Notification Button */}
        <button className="p-2 relative hover:bg-slate-200 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-50"></span>
          )}
        </button>

        {/* Profile Button with Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={toggleProfileMenu}
            className="flex items-center space-x-2 py-1 px-2 cursor-pointer rounded-full hover:bg-slate-200 transition-colors focus:outline-none"
          >
            <div className="relative">
              <img
                className="h-9 w-9 rounded-full  object-cover border border-slate-200"
                src={user.avatar || 'https://picsum.photos/200/300?grayscale'}
                alt={user.name}
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-50"></div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium  text-slate-700">{user.name}</span>
              <span className="text-xs text-slate-500">{user.role || 'User'}</span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 transform origin-top-right transition-all duration-150 ease-in-out z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-700">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>

              <button
                onClick={() => navigate('/agent/profile')}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                <User size={16} className="mr-2 text-slate-500" />
                Profile
              </button>

              <button
                onClick={() => navigate('/agent/settings')}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                <Settings size={16} className="mr-2 text-slate-500" />
                Settings
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
