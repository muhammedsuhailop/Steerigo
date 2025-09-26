import React, { useEffect } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { useAdminOperations } from '../hooks/useAdminOperations';

const AdminDashboard: React.FC = () => {
  const { users, totalUsers, isLoading } = useAppSelector(state => state.adminUsers);
  const { fetchUsers } = useAdminOperations();

  useEffect(() => {
    // Fetch initial data for dashboard
    fetchUsers({
      search: '',
      role: '',
      status: '',
      page: 1,
      limit: 5, // Just get a few for recent users
    });
  }, [fetchUsers]);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      description: 'All registered users',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: users.filter(u => u.status === 'Active').length.toString(),
      description: 'Currently active users',
      color: 'bg-green-500',
    },
    {
      title: 'Pending Users',
      value: users.filter(u => u.status === 'Pending').length.toString(),
      description: 'Awaiting verification',
      color: 'bg-yellow-500',
    },
    {
      title: 'Drivers',
      value: users.filter(u => u.role === 'Driver').length.toString(),
      description: 'Registered drivers',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">
                  {stat.value.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : users.length > 0 ? (
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'Driver' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status || 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
