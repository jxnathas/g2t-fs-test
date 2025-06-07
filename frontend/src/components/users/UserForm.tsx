'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, UserRole } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.nativeEnum(UserRole),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
}

export default function UserForm({ user }: UserFormProps) {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || UserRole.USER,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/dashboard/users');
    },
    onError: (error: any) => {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Failed to create user',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => api.patch(`/users/${user?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      router.push('/dashboard/users');
    },
    onError: (error: any) => {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Failed to update user',
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (!user) {

      createMutation.mutate(data);
    } else {
      if (!data.password) {
        const { password, ...updateData } = data;
        updateMutation.mutate(updateData);
      } else {
        updateMutation.mutate(data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      {errors.root && (
        <div className="text-red-500 text-sm">{errors.root.message}</div>
      )}

      <Input
        label="Name"
        id="name"
        type="text"
        register={register('name')}
        error={errors.name}
      />

      <Input
        label="Email"
        id="email"
        type="email"
        register={register('email')}
        error={errors.email}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        register={register('password')}
        error={errors.password}
        placeholder={user ? 'Leave blank to keep current password' : ''}
      />

      {currentUser?.role === 'admin' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            {...register('role')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {Object.values(UserRole).map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : user
            ? 'Update User'
            : 'Create User'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard/users')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}