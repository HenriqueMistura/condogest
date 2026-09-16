import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Unidades } from './pages/Unidades';
import { Moradores } from './pages/Moradores';
import { Receitas } from './pages/Receitas';
import { Inadimplentes } from './pages/Inadimplentes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="unidades" element={<Unidades />} />
        <Route path="moradores" element={<Moradores />} />
        <Route path="receitas" element={<Receitas />} />
        <Route path="inadimplentes" element={<Inadimplentes />} />
        {/* Despesas placeholder */}
        <Route path="despesas" element={<div className="p-8"><h1 className="text-2xl font-bold">Despesas (Em breve)</h1></div>} />
      </Route>
    </Routes>
  );
}

export default App;
