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
  const [tieneLicencia, setTieneLicencia] = useState(false);
  const [transparencia, setTransparencia] = useState(false);
  
  // Estados para la inspección
  const [temperatura, setTemperatura] = useState('');
  const [estadoSanitario, setEstadoSanitario] = useState('Aprobado');
  const [inspeccionId, setInspeccionId] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      // Usamos el guion bajo para evitar el error de variable no leída
      const { data, error: _ } = await supabase
        .from('vendedores')
        .select('*, inspecciones(*)')
        .eq('id', id)
        .single();
        
      if (data) {
        setNombrePuesto(data.nombre_puesto);
        setTitular(data.titular);
        setUbicacion(data.ubicacion);
        setTieneLicencia(data.tiene_licencia);
        setTransparencia(data.transparencia_ingredientes);
        
        if (data.inspecciones && data.inspecciones.length > 0) {
          const ultima = data.inspecciones[data.inspecciones.length - 1];
          setInspeccionId(ultima.id);
          setTemperatura(ultima.temperatura_cadena_frio);
          setEstadoSanitario(ultima.estado_sanitario);
        }
      }
    };
    cargarDatos();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Actualizar Vendedor
    await supabase.from('vendedores').update({
      nombre_puesto: nombrePuesto,
      titular: titular,
      ubicacion: ubicacion,
      tiene_licencia: tieneLicencia,
      transparencia_ingredientes: transparencia
    }).eq('id', id);

    // 2. Actualizar Inspección
    if (inspeccionId) {
      await supabase.from('inspecciones').update({
        temperatura_cadena_frio: parseFloat(temperatura),
        estado_sanitario: estadoSanitario
      }).eq('id', inspeccionId);
    }
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-slate-500 hover:text-emerald-700 transition">
          <ArrowLeft className="mr-2 h-4 w-4"/> Volver al Panel
        </button>
        
        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Editar Ficha Completa</h2>
          
          <div className="space-y-4 mb-8">
            <input className="w-full border rounded-lg p-3" value={nombrePuesto} onChange={(e) => setNombrePuesto(e.target.value)} placeholder="Nombre Comercial" />
            <input className="w-full border rounded-lg p-3" value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Titular" />
            <input className="w-full border rounded-lg p-3" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ubicación" />
          </div>

          <div className="flex gap-8 mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-emerald-600" checked={tieneLicencia} onChange={(e) => setTieneLicencia(e.target.checked)} />
              <span className="text-sm font-semibold text-slate-700">Licencia</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-emerald-600" checked={transparencia} onChange={(e) => setTransparencia(e.target.checked)} />
              <span className="text-sm font-semibold text-slate-700">Transparencia Pota</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <input type="number" step="0.1" className="w-full border rounded-lg p-3" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} placeholder="Temperatura °C" />
            <select className="w-full border rounded-lg p-3" value={estadoSanitario} onChange={(e) => setEstadoSanitario(e.target.value)}>
              <option value="Aprobado">Aprobado</option>
              <option value="Observado">Observado</option>
              <option value="Clausurado">Clausurado</option>
            </select>
          </div>
          
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-lg w-full transition">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
