'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, UserRole } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import DeleteUserModal from './DeleteUserModal';

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  manager: 'bg-blue-100 text-blue-800',
  user: 'bg-gray-100 text-gray-800',
};

export default function UsersTable() {
  const { user: currentUser } = useAuth();
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      roleColors[user.role]
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/users/edit/${user.id}`}>
                      <Button variant="secondary">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    {currentUser?.role === 'admin' && currentUser.id !== user.id && (
                      <Button
                        variant="danger"
                        onClick={() => {
                          setDeleteUserId(user.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userId={deleteUserId}
      />
    </>
  );
}