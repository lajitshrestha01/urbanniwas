import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/SidebarForAdmin'

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <header className="flex justify-between items-center p-4 bg-white shadow-md md:hidden">
                    <h2 className="text-xl font-semibold">UrbanNiwas Admin</h2>
                    <button
                        className="p-2 rounded bg-blue-500 text-white"  
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        Menu
                    </button>
                </header>
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
