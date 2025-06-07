'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Button from './ui/Button';
import Input from './ui/Input';
import { UserRole } from '@/types/auth';

const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register } = useAuth();
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'user'
      });
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Registration failed',
      });
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="text-red-500 text-sm">{errors.root.message}</div>
      )}
      
      <div className="rounded-md shadow-sm space-y-4">
        <Input
          label="Full name"
          id="name"
          type="text"
          autoComplete="name"
          required
          register={registerForm('name')}
          error={errors.name}
        />
        
        <Input
          label="Email address"
          id="email"
          type="email"
          autoComplete="email"
          required
          register={registerForm('email')}
          error={errors.email}
        />
        
        <Input
          label="Password"
          id="password"
          type="password"
          required
          register={registerForm('password')}
          error={errors.password}
        />
        
        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          required
          register={registerForm('confirmPassword')}
          error={errors.confirmPassword}
        />
      </div>

      <div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </div>

      <div className="text-sm text-center text-purple-800">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}