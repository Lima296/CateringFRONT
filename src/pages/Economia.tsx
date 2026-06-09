import React, { useState, useEffect } from 'react';
import { ventasAPI, recetasAPI } from '../api';
import { DollarSign, TrendingUp, ShoppingCart, Users, Plus, X, Save, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const Economia = () => {
  const [ventas, setVentas] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    receta: '',
    cantidad: 1,
    precio_total: '',
    cliente: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resVentas, resRecetas, resResumen] = await Promise.all([
        ventasAPI.getAll(),
        recetasAPI.getAll(),
        ventasAPI.getResumen()
      ]);
      setVentas(resVentas.data);
      setRecetas(resRecetas.data);
      setResumen(resResumen.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ventasAPI.create(formData);
      setShowModal(false);
      setFormData({ receta: '', cantidad: 1, precio_total: '', cliente: '' });
      fetchData();
    } catch (err) {
      alert("Error al registrar la venta");
    }
  };

  const cardClasses = "bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Economía y Ventas</h1>
          <p className="text-gray-500">Monitoreá la rentabilidad de tu negocio de catering</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus size={20} /> Registrar Venta
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando datos financieros...</div>
      ) : (
        <>
          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className={cardClasses}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-50 px-2 py-1 rounded">Ingresos</span>
              </div>
              <p className="text-3xl font-black text-gray-800">${resumen.total_ingresos.toLocaleString('es-AR')}</p>
              <p className="text-xs text-gray-400 mt-1">Total acumulado en ventas</p>
            </div>

            <div className={cardClasses}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <ArrowDownRight size={20} />
                </div>
                <span className="text-xs font-bold text-red-400 bg-red-50 px-2 py-1 rounded">Costos (COGS)</span>
              </div>
              <p className="text-3xl font-black text-gray-800">${resumen.total_costos.toLocaleString('es-AR')}</p>
              <p className="text-xs text-gray-400 mt-1">Costo de ingredientes vendidos</p>
            </div>

            <div className={cardClasses}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                  <ArrowUpRight size={20} />
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-50 px-2 py-1 rounded">Ganancia Neta</span>
              </div>
              <p className="text-3xl font-black text-gray-800">${resumen.ganancia_neta.toLocaleString('es-AR')}</p>
              <p className="text-xs text-gray-400 mt-1">Beneficio después de costos</p>
            </div>

            <div className={cardClasses}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-50 px-2 py-1 rounded">Margen Promedio</span>
              </div>
              <p className="text-3xl font-black text-gray-800">{resumen.margen_porcentual}%</p>
              <p className="text-xs text-gray-400 mt-1">Eficiencia de rentabilidad</p>
            </div>
          </div>

          {/* Historial de Ventas */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" /> Historial de Ventas por Platos
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Plato / Receta</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4 text-center">Cant.</th>
                    <th className="px-6 py-4">Precio Venta</th>
                    <th className="px-6 py-4">Costo</th>
                    <th className="px-6 py-4">Margen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {ventas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(venta.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {venta.receta_nombre}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {venta.cliente || '---'}
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        {venta.cantidad}
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        ${parseFloat(venta.precio_total).toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 text-red-400">
                        ${parseFloat(venta.costo_total).toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${parseFloat(venta.margen) > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                          ${parseFloat(venta.margen).toLocaleString('es-AR')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ventas.length === 0 && (
                <div className="p-20 text-center text-gray-400">No hay ventas registradas.</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal Registrar Venta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <Plus className="text-green-500" /> Nueva Venta
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Plato / Receta</label>
                <select 
                  required
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-500 bg-white"
                  value={formData.receta}
                  onChange={(e) => setFormData({...formData, receta: e.target.value})}
                >
                  <option value="">Seleccionar receta...</option>
                  {recetas.map(r => (
                    <option key={r.id} value={r.id}>{r.nombre} (Costo: ${parseFloat(r.costo_total).toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Cantidad</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-500"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Precio Total Venta ($)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-500"
                    placeholder="Lo cobrado"
                    value={formData.precio_total}
                    onChange={(e) => setFormData({...formData, precio_total: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Cliente (Opcional)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-500"
                  placeholder="Ej: Boda Familia Perez"
                  value={formData.cliente}
                  onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Guardar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Economia;
