import { useAuth } from '@/features/auth';
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/features/public/components';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <Header />
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              User Dashboard
            </h1>
            <p className="text-gray-600 mb-4">Welcome, {user?.name}!</p>
            <p className="text-sm text-gray-500 mb-4">Email: {user?.email}</p>
            <p className="text-sm text-gray-500 mb-6">Role: {user?.role}</p>
            <button onClick={logout} className="btn btn-secondary px-4 py-2">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

export default UserDashboard;
