import React, { useState } from 'react';
import { authAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.access);
      navigate('/');
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
            <Utensils size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-800">Catering Manager</h1>
          <p className="text-gray-400">Iniciá sesión para gestionar tus costos</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-primary transition-colors"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all transform active:scale-95"
          >
            Entrar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
