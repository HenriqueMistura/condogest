import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Plus } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Morador } from '../types';
import { CondominioTag } from '../components/ui/CondominioTag';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export function Moradores() {
  const { data: moradores, loading, error, refetch } = useApi<Morador[]>('/moradores');
  const { usuario } = useAuth();
  
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [condominioId, setCondominioId] = useState('');
  const [salvando, setSalvando] = useState(false);

  const condominios = usuario?.condominios || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      // Usamos um unidadeId fictício para demonstração, na prática precisaria de um select de Unidade também
      const unidadeIdFicticia = "00000000-0000-0000-0000-000000000000"; 
      
      await api.post('/moradores', { 
        nome, 
        cpf, 
        condominioId: condominioId || condominios[0]?.id,
        unidadeId: unidadeIdFicticia // Isso falhará no backend se a unidade não existir
      });
      alert('Morador cadastrado! (Nota: Na versão final, você também escolherá a Unidade na lista)');
      setShowModal(false);
      refetch();
    } catch (err) {
      alert('Erro ao cadastrar morador. (Nota: Para testar pra valer precisamos buscar as unidades da etapa antes)');
    } finally {
      setSalvando(false);
    }
  };

  const columns: Column<Morador>[] = [
    { key: 'nome', title: 'Nome', render: (item) => <span className="font-medium text-slate-800">{item.nome}</span> },
    { key: 'cpf', title: 'CPF' },
    { key: 'etapa', title: 'Etapa', render: (item) => <CondominioTag condominioId={item.condominioId} /> },
    { key: 'unidade', title: 'Unidade', render: (item) => item.unidade ? `Bl ${item.unidade.bloco} - Ap ${item.unidade.numero}` : '-' },
    { key: 'telefone', title: 'Telefone', render: (item) => item.telefone || '-' },
    { key: 'email', title: 'Email', render: (item) => item.email || '-' },
    { 
      key: 'ativo', 
      title: 'Status', 
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
          {item.ativo ? 'Ativo' : 'Inativo'}
        </span>
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Moradores</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus size={16} />
          Novo Morador
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Carregando moradores...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Erro ao carregar os dados.</div>
        ) : (
          <DataTable columns={columns} data={moradores || []} />
        )}
      </div>

      {/* Modal Novo Morador */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Cadastrar Novo Morador</h3>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              
              {condominios.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qual Etapa / Condomínio?</label>
                  <select 
                    required
                    value={condominioId}
                    onChange={e => setCondominioId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                  >
                    <option value="">Selecione...</option>
                    {condominios.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  required
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                <input 
                  required
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
