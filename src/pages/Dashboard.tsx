import React, { useState, useEffect } from 'react';
import { ingredientesAPI, recetasAPI } from '../api';
import { ShoppingBasket, ChefHat, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIngredientes: 0,
    totalRecetas: 0,
    costoPromedio: 0,
    ingredienteMasCaro: '--'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resIng, resRec] = await Promise.all([
          ingredientesAPI.getAll(),
          recetasAPI.getAll()
        ]);
        
        const ingredientes = resIng.data;
        const recetas = resRec.data;
        
        const totalCostoRecetas = recetas.reduce((acc, r) => acc + parseFloat(r.costo_total), 0);
        const masCaro = ingredientes.length > 0 
          ? ingredientes.reduce((prev, current) => (parseFloat(prev.costo) > parseFloat(current.costo)) ? prev : current).nombre
          : '--';

        setStats({
          totalIngredientes: ingredientes.length,
          totalRecetas: recetas.length,
          costoPromedio: recetas.length > 0 ? totalCostoRecetas / recetas.length : 0,
          ingredienteMasCaro: masCaro
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cardClasses = "bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow";

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-800">Panel de Control</h1>
        <p className="text-gray-500 mt-2 text-lg">Resumen general de tu sistema de costeo.</p>
      </header>

      {loading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={cardClasses}>
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingBasket size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Ingredientes</p>
              <p className="text-4xl font-black text-gray-800">{stats.totalIngredientes}</p>
            </div>
          </div>

          <div className={cardClasses}>
            <div className="w-12 h-12 bg-orange-50 text-primary rounded-2xl flex items-center justify-center mb-4">
              <ChefHat size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Recetas</p>
              <p className="text-4xl font-black text-gray-800">{stats.totalRecetas}</p>
            </div>
          </div>

          <div className={cardClasses}>
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Costo Promedio</p>
              <p className="text-4xl font-black text-gray-800">${stats.costoPromedio.toLocaleString('es-AR', {maximumFractionDigits: 0})}</p>
            </div>
          </div>

          <div className={cardClasses}>
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Más Costoso</p>
              <p className="text-xl font-black text-gray-800 truncate">{stats.ingredienteMasCaro}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Actividad Reciente</h2>
          <div className="space-y-6">
             <div className="flex items-center justify-between py-4 border-b border-gray-50">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 italic">!</div>
                 <p className="text-gray-600">No hay actividad registrada aún.</p>
               </div>
             </div>
          </div>
        </div>
        
        <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-orange-200">
          <h2 className="text-2xl font-bold mb-4">Quick Tip</h2>
          <p className="text-orange-100 leading-relaxed">
            Recordá que los precios de las recetas se actualizan automáticamente cuando modificás el costo de un ingrediente. 
            ¡Mantené tu lista de precios al día!
          </p>
          <button className="mt-8 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors">
            Actualizar Precios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
