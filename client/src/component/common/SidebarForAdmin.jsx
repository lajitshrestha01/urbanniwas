import { NavLink } from 'react-router-dom';
import { UserIcon, HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: ChartBarIcon, end: true },
        { name: 'Agents', path: '/admin/agents', icon: UserIcon },
        { name: 'Properties', path: '/admin/properties', icon: HomeIcon },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 bg-white shadow-md h-screen">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-800">UrbanNiwas Admin</h1>
                    <nav className="mt-6">
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center p-2 mb-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`
                                }
                            >
                                <item.icon className="w-5 h-5 mr-2" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <Dialog open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} className="relative z-50 md:hidden">
                <Dialog.Panel className="fixed inset-0 w-64 bg-white shadow-md p-4">
                    <h1 className="text-2xl font-bold text-gray-800">UrbanNiwas Admin</h1>
                    <nav className="mt-6">
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-2 mb-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`
                                }
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <item.icon className="w-5 h-5 mr-2" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </Dialog.Panel>
            </Dialog>
        </>
    );
};

export default Sidebar;
