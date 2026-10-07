import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Unidades } from './pages/Unidades';
import { Moradores } from './pages/Moradores';
import { Receitas } from './pages/Receitas';
import { Inadimplentes } from './pages/Inadimplentes';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute() {
  const { token, loading } = useAuth();

  if (loading) return null;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="unidades" element={<Unidades />} />
          <Route path="moradores" element={<Moradores />} />
          <Route path="receitas" element={<Receitas />} />
          <Route path="inadimplentes" element={<Inadimplentes />} />
          <Route path="despesas" element={<div className="p-8"><h1 className="text-2xl font-bold">Despesas (Em breve)</h1></div>} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
