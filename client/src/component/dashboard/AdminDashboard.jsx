import { Routes, Route, Navigate } from 'react-router-dom';
import AgentPage from '../../page/AgentPage';
import PropertyPage from '../../page/PropertyPage';
import DashboardPage from '../../page/DashboardPage';
import AdminLayout from '../layout/AdminLayout'

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="agents" element={<AgentPage />} />
                <Route path="properties" element={<PropertyPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminDashboard;
