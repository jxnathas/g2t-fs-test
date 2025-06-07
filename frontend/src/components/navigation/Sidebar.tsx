'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">User Management</h1>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}