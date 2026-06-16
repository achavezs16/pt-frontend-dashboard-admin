'use client';

import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  activo: boolean;
  rol?: string;
  pymeId?: number;
}

export default function GestionRepartidoresPage() {
  const router = useRouter();
  const [repartidores, setRepartidores] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepartidores = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<User[]>('/admin/users/by-role/REPARTIDOR');
      setRepartidores(response.data);
    } catch (err) {
      console.error('Error al obtener repartidores:', err);
      setError('Error al obtener repartidores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepartidores();
  }, []);

  const toggleEstado = async (userId: number, currentStatus: boolean) => {
    try {
      await apiClient.post(`/admin/users/${userId}/toggle-status`, {
        activo: !currentStatus,
      });

      await fetchRepartidores();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error de red.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    router.push('/loginAdmin');
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-950"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando repartidores...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <aside className="w-64 bg-blue-950 text-white flex flex-col justify-between p-5 shadow-lg shrink-0">
        <div className="space-y-6">
          <div className="border-b border-blue-900 pb-4">
            <h2 className="text-xl font-black tracking-tight">PymeTrack Admin</h2>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => router.push('/admin/monitoreo')}
              className="w-full text-left hover:bg-blue-900 px-4 py-2.5 rounded-xl font-semibold text-sm transition text-blue-100"
            >
              📊 Monitoreo Global
            </button>

            <button
              onClick={() => router.push('/admin/pymes')}
              className="w-full text-left hover:bg-blue-900 px-4 py-2.5 rounded-xl font-semibold text-sm transition text-blue-100"
            >
              🏢 Control de PYMEs
            </button>

            <button
              onClick={() => router.push('/admin/repartidores')}
              className="w-full text-left bg-blue-900 px-4 py-2.5 rounded-xl font-bold text-sm"
            >
              🚚 Repartidores
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-left bg-red-950 text-red-200 px-4 py-2.5 rounded-xl font-bold text-sm"
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-black text-gray-900">🚚 Nómina Central de Repartidores</h1>
          <p className="text-gray-500 text-sm mt-1">Monitoreo de estado de conductores logísticos.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Conductor</th>
                <th className="p-4">Email</th>
                <th className="p-4">Empresa N°</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acción</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {repartidores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No hay repartidores registrados.
                  </td>
                </tr>
              ) : (
                repartidores.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-900">
                      {rep.nombre} {rep.apellido || ''}
                    </td>

                    <td className="p-4 text-gray-500">{rep.email}</td>

                    <td className="p-4">
                      {rep.pymeId ? `#${rep.pymeId}` : 'No asignado'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          rep.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rep.activo ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleEstado(rep.id, rep.activo)}
                        className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
                          rep.activo
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {rep.activo ? '⚙️ Suspender' : '✅ Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}