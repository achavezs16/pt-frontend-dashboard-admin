'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { AdminStats } from '@/lib/types';

export default function MonitoreoPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ name: string; role: string } | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [totalPedidos, setTotalPedidos] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      const userRaw = localStorage.getItem('adminUser');
      
      if (!token) {
        router.push('/login');
      } else if (userRaw) {
        setAdmin(JSON.parse(userRaw));
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!admin) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch admin stats
        const statsData = await apiClient.get<AdminStats>('/admin/stats');
        setStats(statsData);

        // Fetch total pedidos from ms-pedidos
        try {
          const pedidos = await apiClient.get<any[]>('http://localhost:8082/api/v1/pedidos');
          setTotalPedidos(pedidos.length);
        } catch (pedidosError) {
          console.warn('Could not fetch pedidos:', pedidosError);
          setTotalPedidos(0);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Asegúrate de que el backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [admin]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">Comprobando credenciales de acceso...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de Navegación Superior */}
      <nav className="bg-blue-950 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📈</span>
          <h1 className="text-xl font-bold tracking-tight">Pyme Track — Panel de Servicio de Reparto</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{admin.name}</p>
            <p className="text-xs text-blue-200 uppercase tracking-wider">{admin.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded transition duration-200"
          >
            Cerrar Sesión 🚪
          </button>
        </div>
      </nav>

      {/* Cuerpo Principal */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Banner de bienvenida */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">¡Bienvenido al Panel de Control del Servicio de Reparto!</h2>
            <p className="text-gray-600 mt-1">Desde aquí supervisas las PYMEs clientes y los repartidores del servicio.</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/pymes')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-5 rounded-lg shadow transition flex items-center space-x-2 shrink-0"
            >
              <span>🏢 Gestionar PYMEs</span>
              <span>➔</span>
            </button>
            <button
              onClick={() => router.push('/admin/repartidores')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-3 px-5 rounded-lg shadow transition flex items-center space-x-2 shrink-0"
            >
              <span>🚚 Gestionar Repartidores</span>
              <span>➔</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas del Servicio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-blue-600">
            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">PYMEs Registradas</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{stats?.totalPymes || 0} Empresas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-purple-600">
            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Repartidores Totales</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{stats?.totalRepartidores || 0} Activos</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-green-600">
            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Pedidos Gestionados</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalPedidos} Despachos</p>
          </div>
        </div>

      </main>
    </div>
  );
}