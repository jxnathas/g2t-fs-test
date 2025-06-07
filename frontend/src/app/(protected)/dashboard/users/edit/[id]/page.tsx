'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import UserForm from '@/components/users/UserForm';

export default function EditUserPage() {
  const { user: currentUser, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (
      !loading &&
      isAuthenticated &&
      currentUser?.role !== 'admin' &&
      currentUser?.id !== userId
    ) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router, currentUser, userId]);

  if (
    loading ||
    !isAuthenticated ||
    isUserLoading ||
    (currentUser?.role !== 'admin' && currentUser?.id !== userId)
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h1>
      <UserForm user={user} />
    </div>
  );
}