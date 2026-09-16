import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, Users, Receipt, CreditCard, AlertTriangle, LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/unidades', label: 'Unidades', icon: Building2 },
    { to: '/moradores', label: 'Moradores', icon: Users },
    { to: '/receitas', label: 'Receitas', icon: Receipt },
    { to: '/despesas', label: 'Despesas', icon: CreditCard },
    { to: '/inadimplentes', label: 'Inadimplentes', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col fixed h-full inset-y-0 left-0 z-50">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CondoGest</h1>
            <p className="text-xs text-slate-400">Condomínio Niko Baracati</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="text-xs text-center text-slate-400">
          <p>Mistura Tec &copy; {new Date().getFullYear()}</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
