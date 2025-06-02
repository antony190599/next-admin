/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;  // Añadimos esta propiedad que faltaba
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,  // Inicializamos con un valor predeterminado
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);  // Estado para controlar la carga
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    // Solo ejecutar en el entorno del navegador
    if (typeof window !== 'undefined') {
      checkAuthStatus();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Para propósitos de demostración - reemplaza esto con tu llamada API real
      if (email === 'admin@example.com' && password === 'password123') {
        const userData = { email, name: 'Admin User', role: 'admin' };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};