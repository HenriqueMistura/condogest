import React from 'react';
import { Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm sticky top-0 z-40">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700">Administrador</p>
            <p className="text-xs text-slate-500">Síndico</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-500">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
