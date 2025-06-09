'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  UserIcon, 
  UserGroupIcon, 
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await api.get('/users/stats');
      return response.data;
    },
    enabled: !!user && ['admin', 'manager'].includes(user.role)
  });

  const roleColorClass = {
    admin: 'bg-purple-100 text-purple-800',
    manager: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="container mx-auto space-y-8">
      <div className="dashboard-card rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || user?.email}</h1>
        <div className="flex items-center space-x-2">
          <span>Your role:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${roleColorClass[user?.role || 'user']}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {['admin', 'manager'].includes(user?.role || '') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dashboard-card rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-xl font-semibold">{isLoading ? '...' : stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-xl font-semibold">{isLoading ? '...' : stats?.activeUsers || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-xl font-semibold">{isLoading ? '...' : stats?.adminCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-card rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === 'admin' && (
            <Link href="/dashboard/users" className="flex items-center p-4 border rounded-md hover:bg-gray-50 transition-colors">
              <UserGroupIcon className="h-6 w-6 mr-3 text-blue-600" />
              <div>
                <h3 className="font-medium">User Management</h3>
                <p className="text-sm text-gray-500">Create, edit, and manage users</p>
              </div>
            </Link>
          )}
          
          <Link href={`/dashboard/users/edit/${user?.id}`} className="flex items-center p-4 border rounded-md hover:bg-gray-50 transition-colors">
            <UserIcon className="h-6 w-6 mr-3 text-green-600" />
            <div>
              <h3 className="font-medium">My Profile</h3>
              <p className="text-sm text-gray-500">View and edit your profile</p>
            </div>
          </Link>
          
          
        </div>
      </div>

      {['admin', 'manager'].includes(user?.role || '') && (
        <div className="dashboard-card rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 dashboard-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : stats?.recentUsers?.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColorClass[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}