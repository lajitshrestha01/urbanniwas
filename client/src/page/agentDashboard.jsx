import React from 'react';
import DashboardLayout from '../component/layout/dashboardLayout';
import DashboardStats from '../component/dashboard/dashboardStats';

export default function agentDashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-800 text-sm md:text-base">
          Welcome back! Here's an overview of your properties
        </p>
      </div>
      <DashboardStats />
    </DashboardLayout>
  );
}
