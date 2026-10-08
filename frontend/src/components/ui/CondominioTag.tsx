import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  condominioId: string;
}

export function CondominioTag({ condominioId }: Props) {
  const { usuario } = useAuth();
  
  // Encontra o condomínio nos dados do usuário (síndico)
  const condominio = usuario?.condominios?.find(c => c.id === condominioId);

  if (!condominio) return null;

  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border"
      style={{ 
        backgroundColor: `${condominio.corIdentificacao}10`, 
        color: condominio.corIdentificacao,
        borderColor: `${condominio.corIdentificacao}30`
      }}
      title={`Etapa: ${condominio.nome}`}
    >
      <div 
        className="w-1.5 h-1.5 rounded-full" 
        style={{ backgroundColor: condominio.corIdentificacao }}
      />
      {condominio.nome.replace('Condomínio ', '')}
    </span>
  );
}
