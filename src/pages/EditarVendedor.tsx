import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function EditarVendedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombrePuesto, setNombrePuesto] = useState('');
  const [titular, setTitular] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  useEffect(() => {
    const cargarVendedor = async () => {
      const { data, error } = await supabase.from('vendedores').select('*').eq('id', id).single();
      if (error) {
        console.error("Error al cargar:", error);
      } else if (data) {
        setNombrePuesto(data.nombre_puesto);
        setTitular(data.titular);
        setUbicacion(data.ubicacion);
      }
    };
    cargarVendedor();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('vendedores').update({
      nombre_puesto: nombrePuesto,
      titular: titular,
      ubicacion: ubicacion
    }).eq('id', id);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="mb-6 flex items-center text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="mr-2 h-4 w-4"/> Volver al Panel
        </button>
        
        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Editar Ficha del Puesto</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Comercial</label>
            <input className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500" value={nombrePuesto} onChange={(e) => setNombrePuesto(e.target.value)} placeholder="Ej. El Huarique de la Pota" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Titular</label>
            <input className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500" value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Ej. Juan Pérez" />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación</label>
            <input className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ej. Av. Grau 500" />
          </div>
          
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-lg w-full transition">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
