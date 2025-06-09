'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  UsersIcon, 
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 h-screen shadow-md bg-card flex flex-col">
      <div className="p-4 border-b border-muted">
        <h1 className="text-xl font-bold text-foreground">User Management</h1>
        <div className="flex items-center mt-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
          <div className="ml-2">
            <p className="text-sm text-foreground">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || 'user'}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 flex-grow overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-2 rounded ${isActive('/dashboard') 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-hover-bg text-foreground'}`}
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              href={`/dashboard/users/edit/${user?.id}`}
              className={`flex items-center px-4 py-2 rounded ${pathname.includes(`/dashboard/users/edit/${user?.id}`) 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-hover-bg text-foreground'}`}
            >
              <UserIcon className="h-5 w-5 mr-3" />
              My Profile
            </Link>
          </li>
          
          {['admin', 'manager'].includes(user?.role || '') && (
            <>
              {/* Analytics */}
              <li>
                <Link
                  href="/dashboard/analytics"
                  className={`flex items-center px-4 py-2 rounded ${isActive('/dashboard/analytics') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-hover-bg text-foreground'}`}
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  Analytics
                </Link>
              </li>
              
              <li>
                <Link
                  href="/dashboard/reports"
                  className={`flex items-center px-4 py-2 rounded ${isActive('/dashboard/reports') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-hover-bg text-foreground'}`}
                >
                  <DocumentTextIcon className="h-5 w-5 mr-3" />
                  Reports
                </Link>
              </li>
            </>
          )}
          
          {user?.role === 'admin' && (
            <>
              <li>
                <Link
                  href="/dashboard/users"
                  className={`flex items-center px-4 py-2 rounded ${isActive('/dashboard/users') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-hover-bg text-foreground'}`}
                >
                  <UsersIcon className="h-5 w-5 mr-3" />
                  User Management
                </Link>
              </li>
              
              <li>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center px-4 py-2 rounded ${isActive('/dashboard/settings') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-hover-bg text-foreground'}`}
                >
                  <CogIcon className="h-5 w-5 mr-3" />
                  System Settings
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-muted mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 rounded hover:bg-hover-bg text-foreground"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}