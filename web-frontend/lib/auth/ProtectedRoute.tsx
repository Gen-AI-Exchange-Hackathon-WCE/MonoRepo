"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// List of public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/terms',
  '/privacy',
  '/explore' // Allow explore page for browsing
];

// Check if a route is public
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
};

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If still loading, don't redirect
    if (isLoading) return;

    // If authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && user && (pathname === '/auth/login' || pathname === '/auth/signup')) {
      const getDashboardRoute = () => {
        switch (user.role) {
          case "ARTIST":
            return "/dashboard";
          case "INVESTOR":
            return "/investor-dashboard";
          default:
            return "/customer-dashboard";
        }
      };
      router.push(getDashboardRoute());
      return;
    }

    // If route is public, allow access
    if (isPublicRoute(pathname)) return;

    // If not authenticated and trying to access protected route, redirect to login
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If route is public, always show content
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  // If authenticated, show protected content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated and trying to access protected route, show nothing (redirect is happening)
  return null;
}

// Higher-order component for easier usage
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
