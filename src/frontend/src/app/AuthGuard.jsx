'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
    const restrictedRoutes = ['/consultar', '/register'];
    const isAuthenticated = !!localStorage.getItem('token');

    if (!publicRoutes.includes(pathname) && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Chequeo de rol para rutas restringidas
    if (restrictedRoutes.includes(pathname)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const rol = user.rol;
      if (rol !== 'SUPERVISOR' && rol !== 'GERENTE') {
        router.replace('/main');
        return;
      }
    }
  }, [pathname, router]);

  return children;
}
