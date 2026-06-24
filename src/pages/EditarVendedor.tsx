import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

export default function EditarVendedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nombrePuesto, setNombrePuesto] = useState('');
  const [titular, setTitular] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  useEffect(() => {
    const cargarVendedor = async () => {
      const { data, error } = await supabase.from('vendedores').select('*').eq('id', id).single();
      if (data) {
        setNombrePuesto(data.nombre_puesto);
        setTitular(data.titular);
        setUbicacion(data.ubicacion);
      }
      setLoading(false);
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
    <div className="p-12 max-w-2xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-4 flex items-center text-slate-500"><ArrowLeft className="mr-2"/> Volver</button>
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6">Editar Ficha</h2>
        <input className="w-full border p-2 mb-4" value={nombrePuesto} onChange={(e) => setNombrePuesto(e.target.value)} placeholder="Nombre" />
        <input className="w-full border p-2 mb-4" value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Titular" />
        <input className="w-full border p-2 mb-4" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ubicación" />
        <button className="bg-emerald-600 text-white p-3 rounded-lg w-full">Guardar Cambios</button>
      </form>
    </div>
  );
}
