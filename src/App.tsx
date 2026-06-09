import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBasket, ChefHat, LogOut, LayoutDashboard, Wallet } from 'lucide-react';
import Login from './pages/Login';
import Ingredientes from './pages/Ingredientes';
import Recetas from './pages/Recetas';
import Dashboard from './pages/Dashboard';
import RecetaDetalle from './pages/RecetaDetalle';
import Economia from './pages/Economia';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/ingredientes', label: 'Ingredientes', icon: <ShoppingBasket size={20} /> },
    { path: '/recetas', label: 'Recetas', icon: <ChefHat size={20} /> },
    { path: '/economia', label: 'Economía', icon: <Wallet size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-primary p-2 rounded-lg">
            <ChefHat size={24} />
          </div>
          <span className="text-xl font-black tracking-tight">CATERING</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-primary text-white shadow-lg shadow-orange-900/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors mt-auto"
        >
          <LogOut size={20} />
          <span className="font-semibold">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Admin Usuario</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-primary/20"></div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/ingredientes" element={
        <PrivateRoute>
          <Layout>
            <Ingredientes />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/recetas" element={
        <PrivateRoute>
          <Layout>
            <Recetas />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/recetas/:id" element={
        <PrivateRoute>
          <Layout>
            <RecetaDetalle />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/economia" element={
        <PrivateRoute>
          <Layout>
            <Economia />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
