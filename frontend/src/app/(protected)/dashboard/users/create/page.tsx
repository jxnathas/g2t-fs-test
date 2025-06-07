'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserForm from '@/components/users/UserForm';
export default function CreateUserPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading || !isAuthenticated || user?.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New User</h1>
      <UserForm />
    </div>
  );
}