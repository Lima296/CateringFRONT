import React, { useState, useEffect } from 'react';
import { ingredientesAPI } from '../api';
import { Plus, Trash2, Edit3, ShoppingBasket, X, Save } from 'lucide-react';

const Ingredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    categoria: 'ALMACEN', 
    unidad_medida: 'UN',
    costo: '' 
  });

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const fetchIngredientes = async () => {
    try {
      const res = await ingredientesAPI.getAll();
      setIngredientes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData({ nombre: '', categoria: 'ALMACEN', unidad_medida: 'UN', costo: '' });
    setShowModal(true);
  };

  const openEditModal = (ing) => {
    setEditMode(true);
    setSelectedId(ing.id);
    setFormData({ 
      nombre: ing.nombre, 
      categoria: ing.categoria, 
      unidad_medida: ing.unidad_medida,
      costo: ing.costo 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este ingrediente?")) return;
    try {
      await ingredientesAPI.delete(id);
      fetchIngredientes();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await ingredientesAPI.update(selectedId, formData);
      } else {
        await ingredientesAPI.create(formData);
      }
      setShowModal(false);
      fetchIngredientes();
    } catch (err) {
      alert("Error al guardar");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ingredientes</h1>
          <p className="text-gray-500">Gestioná el stock y costos de tu materia prima</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-primary hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus size={20} /> Nuevo Ingrediente
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredientes.map((ing) => (
            <div key={ing.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-50 rounded-lg text-primary">
                  <ShoppingBasket size={24} />
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {ing.categoria}
                    </span>
                    <span className="text-[10px] font-bold text-orange-400 border border-orange-100 px-2 py-0.5 rounded-full">
                    {ing.unidad_medida}
                    </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{ing.nombre}</h3>
              <p className="text-2xl font-bold text-primary mb-4">
                ${parseFloat(ing.costo).toLocaleString('es-AR')}
                <span className="text-sm font-normal text-gray-400 ml-1">/ {ing.unidad_medida}</span>
              </p>
              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => openEditModal(ing)}
                  className="flex-1 flex justify-center py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(ing.id)}
                  className="flex-1 flex justify-center py-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal CRUD */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editMode ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-primary"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select 
                    className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-primary bg-white"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    >
                    <option value="VERDULERIA">Verdulería</option>
                    <option value="CARNES">Carnes</option>
                    <option value="ALMACEN">Almacén</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                    <select 
                    className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-primary bg-white"
                    value={formData.unidad_medida}
                    onChange={(e) => setFormData({...formData, unidad_medida: e.target.value})}
                    >
                    <option value="KG">Kilogramo</option>
                    <option value="L">Litro</option>
                    <option value="UN">Unidad</option>
                    <option value="GR">Gramo</option>
                    </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo por Unidad ($)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-primary"
                  value={formData.costo}
                  onChange={(e) => setFormData({...formData, costo: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ingredientes;
