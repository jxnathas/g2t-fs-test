'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import UserForm from '@/components/users/UserForm';
import { User } from '@/types/auth';

export default function UserActionPage() {
  const params = useParams();
  const id = params.id as string;
  const action = Array.isArray(params.action) ? params.action[0] : params.action as string;
  const router = useRouter();
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(action === 'edit');

  useEffect(() => {
    if (action === 'edit' && id) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/users/${id}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          router.push('/dashboard/users');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [action, id, router]);

  if (loading) return <div>Loading user data...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {action === 'new' ? 'Create New User' : 'Edit User'}
      </h1>
      
      <UserForm user={userData} />
    </div>
  );
}