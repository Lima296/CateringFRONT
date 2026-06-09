import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recetasAPI, ingredientesAPI } from '../api';
import { ChefHat, ArrowLeft, Save, Plus, Trash2, Calculator, Info } from 'lucide-react';

const RecetaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);
  const [ingredientesList, setIngredientesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [resRec, resIng] = await Promise.all([
        recetasAPI.getOne(id),
        ingredientesAPI.getAll()
      ]);
      const data = resRec.data;
      setReceta(data);
      setNombre(data.nombre);
      setDescripcion(data.descripcion || '');
      // Transformamos los detalles existentes al formato del input
      setDetalles(data.detalles.map(d => ({
        ingrediente: d.ingrediente,
        cantidad_usada: d.cantidad_usada
      })));
      setIngredientesList(resIng.data);
    } catch (err) {
      console.error(err);
      navigate('/recetas');
    } finally {
      setLoading(false);
    }
  };

  const agregarFila = () => {
    setDetalles([...detalles, { ingrediente: '', cantidad_usada: 1 }]);
  };

  const quitarFila = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newDetalles = [...detalles];
    newDetalles[index][field] = value;
    setDetalles(newDetalles);
  };

  const handleSave = async () => {
    try {
      await recetasAPI.update(id, {
        nombre,
        descripcion,
        ingredientes_input: detalles
      });
      alert("Receta actualizada con éxito");
      fetchData();
    } catch (err) {
      alert("Error al actualizar");
    }
  };

  const calcularCostoTotal = () => {
    return detalles.reduce((total, item) => {
      const ing = ingredientesList.find(i => i.id === item.ingrediente);
      return total + (ing ? parseFloat(ing.costo) * parseFloat(item.cantidad_usada || 0) : 0);
    }, 0);
  };

  if (loading) return <div className="p-10 text-center">Cargando receta...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/recetas')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} /> Volver a Recetas
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header de la Receta */}
        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              <input 
                type="text"
                className="text-4xl font-black text-gray-800 bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full mb-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <div className="flex items-center gap-2 text-primary font-bold">
                <ChefHat size={20} />
                <span>ID: {id.substring(0,8)}...</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Costo Dinámico</p>
              <p className="text-5xl font-black text-primary">${calcularCostoTotal().toLocaleString('es-AR')}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Columna Izquierda: Descripción */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Info size={18} className="text-primary" /> Descripción
              </h2>
              <textarea 
                className="w-full h-64 border border-gray-200 rounded-2xl p-4 outline-none focus:border-primary transition-all text-gray-600 leading-relaxed"
                placeholder="Escribí aquí el procedimiento o notas de la receta..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            
            <button 
              onClick={handleSave}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-3"
            >
              <Save size={24} /> Guardar Cambios
            </button>
          </div>

          {/* Columna Derecha: Ingredientes */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calculator size={18} className="text-primary" /> Ingredientes Seleccionados
              </h2>
              <button 
                onClick={agregarFila}
                className="text-primary font-bold text-sm flex items-center gap-1 hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors"
              >
                <Plus size={16} /> Añadir Ingrediente
              </button>
            </div>

            <div className="space-y-3">
              {detalles.map((item, index) => (
                <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                  <select 
                    className="flex-1 bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-primary"
                    value={item.ingrediente}
                    onChange={(e) => handleChange(index, 'ingrediente', e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {ingredientesList.map(ing => (
                      <option key={ing.id} value={ing.id}>{ing.nombre} (${ing.costo}/{ing.unidad_medida})</option>
                    ))}
                  </select>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.001"
                      className="w-28 bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-primary pr-10"
                      value={item.cantidad_usada}
                      onChange={(e) => handleChange(index, 'cantidad_usada', e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                        {ingredientesList.find(i => i.id === item.ingrediente)?.unidad_medida || ''}
                    </span>
                  </div>
                  <button 
                    onClick={() => quitarFila(index)}
                    className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              
              {detalles.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                   <p className="text-gray-400">No hay ingredientes en esta receta.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecetaDetalle;
