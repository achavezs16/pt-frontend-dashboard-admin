'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User } from '@/lib/types';

export default function GestionPymesPage() {
  const router = useRouter();
  const [pymes, setPymes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPymes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users with PYME role
        const pymeUsers = await apiClient.get<User[]>('/admin/users/by-role/PYME');
        setPymes(pymeUsers);
      } catch (err: any) {
        console.error('Error fetching pymes:', err);
        setError('Error al cargar las PYMEs. Asegúrate de que el backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchPymes();
  }, []);

  // Function to toggle PYME status
  const toggleEstado = async (userId: number, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/toggle-status`, { activo: !currentStatus });
      
      // Refresh the list
      const pymeUsers = await apiClient.get<User[]>('/admin/users/by-role/PYME');
      setPymes(pymeUsers);
    } catch (err: any) {
      console.error('Error toggling status:', err);
      alert('Error al cambiar el estado de la PYME');
    }
  };

  // Count repartidores per PYME
  const countRepartidoresByPyme = (pymeId: number) => {
    return 0; // This would need to be calculated from the repartidores list
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Cargando PYMEs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
      {/* Barra Superior */}
      <nav className="bg-blue-950 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🏢</span>
          <h1 className="text-xl font-bold tracking-tight">Pyme Track — Gestión de PYMEs</h1>
        </div>
        <button 
          onClick={() => router.push('/admin/monitoreo')}
          className="bg-gray-700 hover:bg-gray-600 text-xs font-bold py-2 px-4 rounded transition"
        >
          Volver al Resumen 📊
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Encabezado de la sección */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Gestión de PYMEs (Clientes del Servicio)</h2>
          <p className="text-gray-600 text-sm mt-1">
            Como administrador del servicio de reparto, aquí puedes activar/desactivar PYMEs clientes.
          </p>
        </div>

        {/* Tabla de Gestión */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Empresa / PYME</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Email</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Estado del Servicio</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {pymes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No hay PYMEs registradas
                  </td>
                </tr>
              ) : (
                pymes.map((pyme) => (
                  <tr key={pyme.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-900">{pyme.nombre}</td>
                    <td className="p-4 text-gray-600">{pyme.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        pyme.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pyme.activo ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleEstado(pyme.id, pyme.activo)}
                        className={`text-xs font-bold py-1.5 px-3 rounded transition ${
                          pyme.activo
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
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

      </main>
    </div>
  );
}