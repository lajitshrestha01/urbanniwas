import React, { useState } from 'react';
import { Menu, Home, Building2, PlusCircle, Mail, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: '/agent/dashboard' },
    { name: "My Properties", icon: <Building2 size={20} />, path: '/agent/properties' },
    { name: "Add Property", icon: <PlusCircle size={20} />, path: '/agent/add-property' },
    { name: "Messages", icon: <Mail size={20} />, path: '/message' },
    { name: "Profile", icon: <User size={20} />, path: '/agent/profile' },
  ];

  return (
    <>
      {/* Mobile top nav */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white text-black border-b border-gray-800">
        <h1 className="text-lg font-bold">UrbanNiwas</h1>
        <button onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-[230px] bg-white border-r border-gray-800 text-black flex flex-col z-40 transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Sidebar header (hidden on mobile) */}
        <div className="p-4 border-b border-gray-800 hidden md:block">
          <Link to="/">
            <h1 className="text-xl font-bold cursor-pointer">UrbanNiwas</h1>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 pt-5">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="flex items-center px-4 py-3 text-sm hover:bg-blue-400 transition-all"
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center text-gray-800 hover:text-red-600">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
