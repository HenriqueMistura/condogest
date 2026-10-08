import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { Condominio } from '../types';
import { Building2, Plus, Users, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function SuperAdminDashboard() {
  const { data: condominios, loading, error } = useApi<Condominio[]>('/condominios');
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [asaasApiKey, setAsaasApiKey] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.post('/condominios', { nome, cnpj, asaasApiKey });
      window.location.reload(); 
    } catch (err) {
      alert('Erro ao criar condomínio');
      setSalvando(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (window.confirm(`ATENÇÃO! Tem certeza que deseja apagar o condomínio "${nome}" e todos os seus dados? Essa ação não tem volta!`)) {
      try {
        await api.delete(`/condominios/${id}`);
        window.location.reload();
      } catch (err) {
        alert('Erro ao excluir condomínio');
      }
    }
  };

  const { login } = useAuth();

  const handleImpersonate = async (condoId: string) => {
    try {
      const response: any = await api.post(`/auth/impersonate/${condoId}`, {});
      
      const currentToken = localStorage.getItem('@CondoGest:token');
      const currentUser = localStorage.getItem('@CondoGest:usuario');
      if (currentToken && currentUser) {
        localStorage.setItem('@CondoGest:adminToken', currentToken);
        localStorage.setItem('@CondoGest:adminUser', currentUser);
      }
      
      login(response.token, response.usuario);
      window.location.href = '/';
    } catch (err: any) {
      console.error("Erro no impersonate:", err);
      alert('Erro detalhado: ' + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando seus clientes...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Erro ao carregar os clientes.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Meus Clientes (Condomínios)</h2>
          <p className="text-slate-500 text-sm">Visão exclusiva do Super Admin</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus size={16} />
          Novo Condomínio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {condominios?.map(condo => (
          <Card key={condo.id} className="relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-2 h-full" 
              style={{ backgroundColor: condo.corIdentificacao }} 
            />
            <div className="pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{condo.nome}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">{condo.cnpj || 'Sem CNPJ'}</p>
                </div>
                <div className="flex gap-2">
                  <div 
                    className="p-2 rounded-lg bg-opacity-10"
                    style={{ backgroundColor: `${condo.corIdentificacao}20`, color: condo.corIdentificacao }}
                  >
                    <Building2 size={20} />
                  </div>
                  <button
                    onClick={() => handleDelete(condo.id, condo.nome)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Excluir cliente"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Building2 size={16} className="text-slate-400"/>
                  <span>{condo._count?.unidades || 0} Unidades</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-slate-400"/>
                  <span>{condo._count?.moradores || 0} Moradores</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => handleImpersonate(condo.id)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver Painel do Síndico &rarr;
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Criação Simples */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Cadastrar Novo Condomínio</h3>
              <p className="text-sm text-slate-500">Adicione uma nova etapa ou prédio.</p>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Condomínio</label>
                <input 
                  required
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Ex: Condomínio Flores Etapa 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ (Opcional)</label>
                <input 
                  value={cnpj}
                  onChange={e => setCnpj(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="00.000.000/0001-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chave API Asaas (Opcional)</label>
                <input 
                  value={asaasApiKey}
                  onChange={e => setAsaasApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="$aact_Mzkw..."
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={salvando}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {salvando ? 'Salvando...' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
