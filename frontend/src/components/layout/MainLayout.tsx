import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
  const location = useLocation();
  
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/unidades':
        return 'Unidades';
      case '/moradores':
        return 'Moradores';
      case '/receitas':
        return 'Receitas';
      case '/despesas':
        return 'Despesas';
      case '/inadimplentes':
        return 'Gestão de Inadimplentes';
      default:
        return 'CondoGest';
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={getPageTitle(location.pathname)} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
