import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { Condominio } from '../types';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  condominios?: Condominio[];
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('@CondoGest:token');
    const storedUser = localStorage.getItem('@CondoGest:usuario');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, novoUsuario: Usuario) => {
    localStorage.setItem('@CondoGest:token', newToken);
    localStorage.setItem('@CondoGest:usuario', JSON.stringify(novoUsuario));
    setToken(newToken);
    setUsuario(novoUsuario);
  };

  const logout = () => {
    localStorage.removeItem('@CondoGest:token');
    localStorage.removeItem('@CondoGest:usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
