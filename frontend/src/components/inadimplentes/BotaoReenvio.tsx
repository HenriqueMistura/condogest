import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Mail, ChevronDown } from 'lucide-react';

interface BotaoReenvioProps {
  id: string;
  nome: string;
}

export function BotaoReenvio({ id, nome }: BotaoReenvioProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (type: string) => {
    alert(`Enviando cobrança para ${nome} via ${type} (ID: ${id})`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
      >
        <Send size={16} />
        Cobrar
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10">
          <button
            onClick={() => handleAction('WhatsApp')}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <MessageCircle size={16} className="text-green-500" />
            WhatsApp
          </button>
          <button
            onClick={() => handleAction('Email')}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Mail size={16} className="text-blue-500" />
            Email
          </button>
        </div>
      )}
    </div>
  );
}
