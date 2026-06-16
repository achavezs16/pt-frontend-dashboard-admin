'use client';

import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AdminStats {
  totalPymes: number;
  totalRepartidores: number;
  totalAdmins: number;
  totalPedidos: number;
  ultimaActualizacion?: string;
}

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
        router.push('/loginAdmin');
      } else if (userRaw) {
        setAdmin(JSON.parse(userRaw));
      } else {
        setAdmin({ name: 'Administrador', role: 'ADMIN' });
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!admin) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get<AdminStats>('/bff/admin/stats');
        const statsData = response.data;

        setStats(statsData);
        setTotalPedidos(statsData.totalPedidos || 0);
      } catch (err: any) {
        console.error('Error al cargar datos de monitoreo:', err);
        setError('Error al conectar con el BFF. Verifica que gateway y ms-bff estén corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [admin]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    router.push('/loginAdmin');
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-950"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando métricas globales del sistema...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950">📊 Panel de Monitoreo Global</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">
            Bienvenido, <span className="text-blue-700 font-bold">{admin?.name || 'Administrador'}</span> • Vista general de la infraestructura.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => router.push('/admin/pymes')}
            className="bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition"
          >
            🏢 Ver PYMEs
          </button>
          <button 
            onClick={() => router.push('/admin/repartidores')}
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition"
          >
            🚚 Ver Repartidores
          </button>
          <button 
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition"
          >
            🚪 Salir
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-sm text-red-700 p-4 rounded-xl flex items-start space-x-2">
          <span>⚠️</span>
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-blue-600">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">PYMEs Registradas</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{stats?.totalPymes || 0} Empresas</p>
          <p className="text-xs text-green-600 font-medium mt-1">● BFF vía Gateway</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-purple-600">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Repartidores Activos</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{stats?.totalRepartidores || 0} Conductores</p>
          <p className="text-xs text-green-600 font-medium mt-1">● Agregado desde BFF</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-emerald-600">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Flujo Total de Órdenes</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{totalPedidos} Pedidos</p>
          <p className="text-xs text-blue-600 font-medium mt-1">📡 ms-pedidos vía BFF</p>
        </div>
      </div>
    </div>
  );
}