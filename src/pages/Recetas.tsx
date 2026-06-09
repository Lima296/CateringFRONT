import React, { useState, useEffect } from 'react';
import { recetasAPI, ingredientesAPI } from '../api';
import { ChefHat, Plus, Trash2, ChevronRight, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Recetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [ingredientesList, setIngredientesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();

  // Form state
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRecetas, resIng] = await Promise.all([
        recetasAPI.getAll(),
        ingredientesAPI.getAll()
      ]);
      setRecetas(resRecetas.data);
      setIngredientesList(resIng.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Evitar navegar al detalle
    if (!window.confirm("¿Deseas eliminar esta receta?")) return;
    try {
      await recetasAPI.delete(id); // Asumiendo que existe en ingredientesAPI o similar, pero recetas tiene su endpoint
      // Debería agregar delete a recetasAPI en api.ts si no está
      fetchData();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const agregarFilaIngrediente = () => {
    setIngredientesSeleccionados([...ingredientesSeleccionados, { ingrediente: '', cantidad_usada: 1 }]);
  };

  const quitarFilaIngrediente = (index) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.filter((_, i) => i !== index));
  };

  const handleIngredienteChange = (index, field, value) => {
    const newItems = [...ingredientesSeleccionados];
    newItems[index][field] = value;
    setIngredientesSeleccionados(newItems);
  };

  const calcularCostoPreview = () => {
    return ingredientesSeleccionados.reduce((total, item) => {
      const ing = ingredientesList.find(i => i.id === item.ingrediente);
      return total + (ing ? parseFloat(ing.costo) * parseFloat(item.cantidad_usada || 0) : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recetasAPI.create({
        nombre,
        descripcion,
        ingredientes_input: ingredientesSeleccionados
      });
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert("Error al crear la receta");
    }
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setIngredientesSeleccionados([]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recetas</h1>
          <p className="text-gray-500">Calculá costos de producción automáticamente</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus size={20} /> Crear Receta
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">Cargando...</div>
      ) : (
        <div className="space-y-4">
          {recetas.map((receta) => (
            <div 
              key={receta.id} 
              onClick={() => navigate(`/recetas/${receta.id}`)}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-primary/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-primary">
                  <ChefHat size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{receta.nombre}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1 max-w-md">{receta.descripcion || 'Sin descripción'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Costo Total</p>
                  <p className="text-2xl font-black text-gray-800">${parseFloat(receta.costo_total).toLocaleString('es-AR')}</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={(e) => handleDelete(e, receta.id)}
                        className="p-2 text-red-300 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                    <div className="p-2 bg-gray-50 text-gray-400 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronRight size={24} />
                    </div>
                </div>
              </div>
            </div>
          ))}

          {recetas.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <ChefHat size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 font-medium">No tenés recetas creadas todavía.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Creación de Receta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-800">Nueva Receta</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Receta</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Asado para 10 personas"
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-primary transition-all text-lg font-medium"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                <textarea 
                  placeholder="Instrucciones o detalles adicionales..."
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-primary transition-all min-h-[100px]"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-bold text-gray-700">Ingredientes y Cantidades</label>
                  <button 
                    type="button"
                    onClick={agregarFilaIngrediente}
                    className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={16} /> Agregar Fila
                  </button>
                </div>

                <div className="space-y-3">
                  {ingredientesSeleccionados.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <select 
                        required
                        className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-primary bg-white"
                        value={item.ingrediente}
                        onChange={(e) => handleIngredienteChange(index, 'ingrediente', e.target.value)}
                      >
                        <option value="">Seleccionar ingrediente...</option>
                        {ingredientesList.map(ing => (
                          <option key={ing.id} value={ing.id}>{ing.nombre} (${ing.costo}/{ing.unidad_medida})</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        required
                        step="0.001"
                        placeholder="Cant."
                        className="w-24 border border-gray-200 rounded-xl p-3 outline-none focus:border-primary"
                        value={item.cantidad_usada}
                        onChange={(e) => handleIngredienteChange(index, 'cantidad_usada', e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => quitarFilaIngrediente(index)}
                        className="text-red-400 hover:bg-red-50 p-3 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Costo Estimado</p>
                <p className="text-3xl font-black text-primary">${calcularCostoPreview().toLocaleString('es-AR')}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-500 font-bold hover:bg-white rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSubmit}
                  className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
                >
                  <Save size={20} /> Guardar Receta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recetas;
