'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  
  // Estados de los campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de control de la UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificación simulada en el cliente al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        console.log('Token de prueba detectado. Redirigiendo a monitoreo...');
        router.push('/admin/monitoreo');
      }
    }
  }, [router]);

  // Manejo de Login SIMULADO (Para pruebas locales de diseño y UI)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Simulando transmisión de credenciales...');
      
      // 1. Simulamos un retraso de red de 1.5 segundos para ver el spinner
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. Guardamos datos de prueba para verificar que Next.js responda correctamente
      localStorage.setItem('adminToken', 'token-falso-de-prueba-123');
      localStorage.setItem('adminUser', JSON.stringify({ name: 'Admin Demo', role: 'ADMIN' }));

      console.log('✅ Acceso simulado con éxito.');
      
      // 3. Redirigimos al área protegida
      router.push('/admin/monitoreo');
      
    } catch (err: any) {
      setError('Ocurrió un error inesperado en la simulación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        {/* Header del Panel */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Pyme Track</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Panel de Administrador</p>
          <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 uppercase tracking-wider">
            Modo Demo / Pruebas
          </div>
        </div>

        {/* Banner de Errores */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-700 p-3 rounded-md flex items-start space-x-2">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
              placeholder="admin@pymetrack.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium text-sm disabled:opacity-50 flex items-center justify-center h-[40px]"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Verificando...</span>
              </span>
            ) : (
              'Ingresar al Sistema'
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            💡 Ingresa cualquier dato para probar la interfaz y las transiciones.
          </p>
        </div>

      </div>
    </div>
  );
}