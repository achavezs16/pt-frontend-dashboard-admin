// Layout principal del Portal PYME con TypeScript y Tailwind CSS

'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Pedidos', href: '/pedidos', icon: '📦' },
    { name: 'Crear Pedido', href: '/pedidos/crear', icon: '➕' },
    { name: 'Productos', href: '/productos', icon: '🛍️' },
    { name: 'Crear Producto', href: '/productos/crear', icon: '⭐' },
    { name: 'Perfil', href: '/perfil', icon: '👤' },
  ];

  const isActive = (href: string) => {
    const currentPath = pathname || '/';
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleSupport = () => {
    alert(
      'Módulo en proceso de implementación. Para asistencia técnica, llame al 800 465 6700 para comunicarse con un ejecutivo.'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="text-2xl font-bold text-[#1E3A8A]">PymeTrack</div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#374151]">Portal PYME</span>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="h-8 w-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-semibold hover:bg-blue-800 transition"
                >
                  PY
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        router.push('/perfil');
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      👤 Perfil PYME
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSupport();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      🛟 Asistencia técnica
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="mt-5 px-2">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#F3F4F6] text-[#1E3A8A] border-l-4 border-[#1E3A8A]'
                        : 'text-[#374151] hover:bg-[#F3F4F6] hover:text-[#1E3A8A]'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;