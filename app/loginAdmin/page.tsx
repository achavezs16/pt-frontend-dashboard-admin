'use client';

import Button from '@/components/ui/Button';
import { authAdminService } from '@/lib/apiAdmin'; // Importamos tu servicio independiente
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  
  // Estados de los campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para controlar si se muestra o no la contraseña (El Ojito)
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados de control de la UI locales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manejo de Login Conectado directamente a tu cliente aislado
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Transmitiendo credenciales directamente al puerto 8086...');
      
      const response = await authAdminService.login(email, password);
      const { token, userInfo } = response.data;
      
      // Guardamos tokens de sesión estándar del ecosistema
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      document.cookie = `pyme_token=${token}; path=/; max-age=86400; SameSite=Lax`;

      // Guardamos las marcas específicas de admin que necesitas para tus pantallas
      localStorage.setItem('adminToken', 'active-session');
      localStorage.setItem('adminUser', JSON.stringify({ name: userInfo?.nombre || 'Administrador', role: 'ADMIN' }));
      
      console.log('✅ Acceso concedido con éxito al panel de administración.');
      router.push('/admin/monitoreo');
      
    } catch (err: any) {
      console.error('Login error:', err);
      const mensajeError = err.response?.data?.message || err.message || 'Error al iniciar sesión.';
      setError(`${mensajeError} (Verifica que el Gateway en el puerto 8086 esté encendido)`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-white rounded-xl shadow-lg p-8">
        
        {/* Header del Panel */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-950 rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-white text-2xl font-bold">⚙️</span>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-950 tracking-tight">Pyme Track</h2>
          <p className="mt-2 text-sm text-gray-600 font-medium">Portal de Administración Central (Aislado)</p>
        </div>

        {/* Banner de Errores */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-sm text-red-700 p-4 rounded-md flex items-start space-x-2">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input 
                id="email"
                type="email" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@pymetrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Contraseña
              </label>
              
              {/* Contenedor relativo para posicionar el ojo */}
              <div className="relative mt-1">
                <input 
                  id="password"
                  // Cambia dinámicamente entre 'password' y 'text'
                  type={showPassword ? 'text' : 'password'} 
                  className="block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                
                {/* Botón del Ojito */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-blue-950 transition"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    // Ícono de Ojo Abierto 👁️ (SVG nativo para no instalar librerías extras)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    // Ícono de Ojo Cruzado / Cerrado 🙈
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.411m0 0L21 21M17.25 13.512A9.294 9.294 0 0112 15c-1.197 0-2.33-.228-3.375-.642m3.375-7.358A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión en panel...' : 'Ingresar al Sistema'}
          </Button>
        </form>

        {/* Tarjeta de Credenciales de Prueba Informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 space-y-1.5 shadow-sm">
          <p className="font-bold flex items-center gap-1 text-blue-900">🔑 Credenciales Locales (Usa .cl):</p>
          <div className="pl-1 font-mono text-gray-700 space-y-0.5">
            <p><span className="font-semibold text-blue-900">User:</span> admin@pymetrack.cl</p>
            <p><span className="font-semibold text-blue-900">Pass:</span> 12345678</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
          <p>Sistema de Gestión</p>
          <p className="mt-1">© 2026 PymeTrack</p>
        </div>

      </div>
    </div>
  );
}