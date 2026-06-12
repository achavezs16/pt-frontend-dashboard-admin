'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: number;
  nombre: string;
  email?: string;
  role: 'ADMIN' | 'PYME' | 'REPARTIDOR';
  permissions: string[];
  rutPyme?: string;
  pymeId?: number;
  requiresPasswordChange?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isPyme: () => boolean;
  isRepartidor: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token y usuario desde localStorage al montar
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('userInfo'); // Cambiado de pymeInfo a userInfo

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        
        // Validar token con el backend - TEMPORALMENTE DESACTIVADO
        // validateToken(savedToken);
        console.log('🔐 AUTH: Validación automática desactivada temporalmente');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        clearAuth();
      }
    }
    setIsLoading(false);
  }, []);

  const validateToken = async (authToken: string) => {
    try {
      await apiClient.validateToken(authToken);
    } catch (error) {
      console.error('Token validation failed:', error);
      clearAuth();
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.login(email, password);
      const { token: authToken, userInfo, requiresPasswordChange, refreshToken } = response.data;

      // Guardar en estado y localStorage
      console.log('🔐 LOGIN: Guardando token y usuario');
      console.log('🔐 Token:', authToken);
      console.log('🔐 UserInfo:', userInfo);
      
      setToken(authToken);
      setUser(userInfo);
      localStorage.setItem('token', authToken);
      localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Cambiado de pymeInfo a userInfo
      document.cookie = `pyme_token=${authToken}; path=/; max-age=86400; SameSite=Lax`;

      console.log('🔐 LOGIN: Estado guardado, isAuthenticated debería ser true');
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Si requiere cambio de contraseña, redirigir
      if (requiresPasswordChange) {
        if (typeof window !== 'undefined') {
          window.location.href = '/change-password';
        }
      }

      // Redirigir automáticamente después del login exitoso
      if (typeof window !== 'undefined') {
        console.log('🔐 LOGIN: Redirigiendo a dashboard...');
        // Pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          console.log('🔐 LOGIN: Ejecutando redirección a dashboard...');
          window.location.replace('/');
        }, 100);
      }

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    document.cookie = 'pyme_token=; path=/; max-age=0; SameSite=Lax';
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); // Cambiado de pymeInfo a userInfo
    localStorage.removeItem('refreshToken');
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      await apiClient.changePassword(user.id, currentPassword, newPassword);
      
      // Actualizar estado de usuario para no requerir más cambios de contraseña
      const updatedUser = { ...user, requiresPasswordChange: false };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser)); // Cambiado de pymeInfo a userInfo

    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  const refreshTokenAction = async () => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    if (!savedRefreshToken) {
      logout();
      return;
    }

    try {
      const response = await apiClient.refreshToken(savedRefreshToken);
      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  // Métodos de utilidad para roles y permisos
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN';
  };

  const isPyme = (): boolean => {
    return user?.role === 'PYME';
  };

  const isRepartidor = (): boolean => {
    return user?.role === 'REPARTIDOR';
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    changePassword,
    refreshToken: refreshTokenAction,
    isAuthenticated,
    hasPermission,
    isAdmin,
    isPyme,
    isRepartidor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
