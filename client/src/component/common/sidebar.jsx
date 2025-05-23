import React, { useState } from 'react';
import {
  Menu,
  Home,
  Building2,
  PlusCircle,
  Mail,
  User,
  LogOut,
  ChevronRight,
  CalendarPlus,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useUserStore from '../../zustand/store';

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const { user } = useUserStore(); // Access user and unreadCount if stored
  const location = useLocation();

  const agentMenu = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/agent/dashboard' },
    { name: 'My Properties', icon: <Building2 size={20} />, path: '/agent/properties' },
    { name: 'Add Property', icon: <PlusCircle size={20} />, path: '/agent/add-property' },
    { name: 'Messages', icon: <Mail size={20} />, path: '/agent/message' },
    { name: 'Booking Request', icon: <CalendarPlus size={20} />, path: '/agent/booking-request' },
    { name: 'Profile', icon: <User size={20} />, path: '/agent/profile' },
  ];

  const clientMenu = [
    // { name: 'Dashboard', icon: <Home size={20} />, path: '/client/dashboard' },
    { name: 'Favorite Properties', icon: <Building2 size={20} />, path: '/client/favorites' },
    { name: 'Book Visits', icon: <CalendarPlus size={20} />, path: '/client/visits' },
    { name: 'Messages', icon: <Mail size={20} />, path: '/client/message' },
    { name: 'Profile', icon: <User size={20} />, path: '/client/profile' },
  ];

  const menuItems = role === 'AGENT' ? agentMenu : clientMenu;

  return (
    <>
      {/* Mobile top nav */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-50 text-slate-800 border-b border-slate-200 shadow-sm">
        <h1 className="text-lg font-bold text-slate-700">UrbanNiwas</h1>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-[250px] bg-slate-50 border-r border-slate-200 text-slate-700 flex flex-col z-40 transform transition-all duration-300 ease-in-out shadow-lg md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">UrbanNiwas</h1>
          </Link>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          >
            <ChevronRight size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 pt-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group
                      ${isActive
                        ? 'bg-blue-500/10 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-200/70'
                      }`}
                  >
                    <span
                      className={`${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}
                    >
                      {item.icon}
                    </span>
                    <span className="ml-3 flex-1">{item.name}</span>
                    {item.name === 'Messages' && user.unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {user.unreadCount}
                      </span>
                    )}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-5 rounded-full bg-blue-600"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User profile and logout */}
        <div className="p-4 border-t border-slate-200 mt-auto">
          <button className="flex w-full items-center px-3 py-2.5 text-sm text-black-600 hover:text-red-600 rounded-md transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
