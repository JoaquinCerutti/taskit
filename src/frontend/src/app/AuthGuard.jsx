'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
    const isAuthenticated = !!localStorage.getItem('token');
    if (!publicRoutes.includes(pathname) && !isAuthenticated) {
      router.replace('/login');
    }
  }, [pathname, router]);

  return children;
}
