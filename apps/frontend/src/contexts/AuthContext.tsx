import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

// API Configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'https://api.waiz.cl';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => localStorage.getItem('accessToken');
const setToken = (token: string) => localStorage.setItem('accessToken', token);
const removeToken = () => localStorage.removeItem('accessToken');

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          removeToken();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, accessToken } = response.data.data;
      
      setToken(accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any): Promise<void> => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user: newUser, accessToken } = response.data.data;
      
      setToken(accessToken);
      setUser(newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = (): void => {
    removeToken();
    setUser(null);
    // Optionally call logout endpoint
    api.post('/auth/logout').catch(console.error);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { api };
