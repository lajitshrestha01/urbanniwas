import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../zustand/store';

const Header = () => {
    const { user, logoutUser } = useUserStore();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser(); // Call Zustand logoutUser function
        navigate('/'); // Redirect to home
    };

    return (
        <header className="bg-white border-b border-gray-800 p-4 flex justify-between items-center">
            {/* Empty div for spacing on the left side */}
            <div className="w-8 lg:hidden"></div>

            {/* Notification and Profile Section on the Right */}
            <div className="flex items-center space-x-6 ml-auto">
                {/* Notification Button */}
                <button className="p-2 relative">
                    <Bell className="w-6 h-6" />
                </button>

                {/* Profile Button with Dropdown */}
                <div className="relative">
                    <button onClick={toggleProfileMenu} className="flex items-center text-sm focus:outline-none">
                        <img
                            className="h-10 w-10 rounded-full cursor-pointer"
                            src={user.avatar || 'https://picsum.photos/200/300?grayscale'}
                            alt={user.name}
                        />
                        <span className="ml-2 text-gray-700">{user.name}</span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
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
