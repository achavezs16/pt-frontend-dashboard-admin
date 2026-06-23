'use client';

import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateUserModal from '@/components/admin/CreateUserModal';

interface User {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  activo: boolean;
  rol?: string;
  pymeId?: number;
}

export default function GestionPymesPage() {
  const router = useRouter();
  const [pymes, setPymes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchPymes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<User[]>('/admin/users/by-role/PYME');
      setPymes(response.data);
    } catch (err) {
      console.error('Error al cargar PYMEs:', err);
      setError('Error al cargar datos de las PYMEs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPymes();
  }, []);

  const toggleEstado = async (userId: number, currentStatus: boolean) => {
    try {
      await apiClient.post(`/admin/users/${userId}/toggle-status`, {
        activo: !currentStatus,
      });

      await fetchPymes();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('No se pudo cambiar el estado.');
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
        <p className="mt-4 text-gray-600 font-medium">Cargando PYMEs...</p>
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
              className="w-full text-left bg-blue-900 px-4 py-2.5 rounded-xl font-bold text-sm"
            >
              🏢 Control de PYMEs
            </button>

            <button
              onClick={() => router.push('/admin/repartidores')}
              className="w-full text-left hover:bg-blue-900 px-4 py-2.5 rounded-xl font-semibold text-sm transition text-blue-100"
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              🏢 Gestión Central de PYMEs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Supervisión operativa de empresas inscritas.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-950 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-900 transition"
          >
            ➕ Nueva PYME
          </button>
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
                <th className="p-4">Empresa</th>
                <th className="p-4">Email</th>
                <th className="p-4">ID PYME</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acción</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {pymes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No hay PYMEs registradas.
                  </td>
                </tr>
              ) : (
                pymes.map((pyme) => (
                  <tr key={pyme.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-900">
                      {pyme.nombre} {pyme.apellido || ''}
                    </td>

                    <td className="p-4 text-gray-500">{pyme.email}</td>

                    <td className="p-4 text-gray-600">
                      {pyme.pymeId ? `#${pyme.pymeId}` : 'No asignado'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          pyme.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {pyme.activo ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleEstado(pyme.id, pyme.activo)}
                        className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
                          pyme.activo
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {pyme.activo ? '⚙️ Suspender' : '✅ Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          role="PYME"
          onCreated={fetchPymes}
        />
      </main>
    </div>
  );
}