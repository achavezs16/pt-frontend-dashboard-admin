'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirección forzada inmediata al Login de Administrador
    router.replace('/loginAdmin');
  }, [router]);

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );
}