import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Definimos la interfaz para el estado de la lista
interface Especialidad {
  id: string;
  nombre: string;
}

export default function Step2Profesional({ onNext, onBack }: any) {
  const [especialidadesLista, setEspecialidadesLista] = useState<Especialidad[]>([]);
  const [data, setData] = useState({ 
    colegiatura: '', 
    anos_experiencia: '', 
    especialidades: [] as string[], 
    bio: '' 
  });

  // Cargar especialidades desde la base de datos
  useEffect(() => {
    async function fetchEspecialidades() {
      const { data: espData, error } = await supabase.from('especialidades').select('id, nombre');
      if (!error && espData) {
        setEspecialidadesLista(espData);
      }
    }
    fetchEspecialidades();
  }, []);

  const toggleEspecialidad = (idSeleccionado: string) => {
    setData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(idSeleccionado)
        ? prev.especialidades.filter(id => id !== idSeleccionado)
        : [...prev.especialidades, idSeleccionado]
    }));
  };

  const validate = () => {
    if (!/^[A-Z0-9-]+$/i.test(data.colegiatura)) return alert("Colegiatura inválida");
    if (!/^\d+$/.test(data.anos_experiencia)) return alert("Años de experiencia debe ser un número");
    if (data.especialidades.length === 0) return alert("Selecciona al menos una especialidad");
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-[#0A1E3D]">Información profesional</h3>
      
      {/* Inputs adaptables: 1 columna en móvil, 2 en PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs sm:text-sm font-semibold text-slate-500">N° de colegiatura (CFTP)</label>
          <input 
            placeholder="CFTP-12345" 
            className="w-full p-3.5 sm:p-4 text-sm sm:text-base border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1A5C3A] transition" 
            value={data.colegiatura}
            onChange={e => setData({...data, colegiatura: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs sm:text-sm font-semibold text-slate-500">Años de experiencia</label>
          <input 
            type="number" 
            placeholder="5" 
            className="w-full p-3.5 sm:p-4 text-sm sm:text-base border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1A5C3A] transition" 
            value={data.anos_experiencia}
            onChange={e => setData({...data, anos_experiencia: e.target.value})} 
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-500">Especialidades</label>
        {/* Botones adaptables: 1 columna en móvil pequeño, 2 en estándar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {especialidadesLista.map((esp) => (
            <button
              key={esp.id}
              type="button"
              onClick={() => toggleEspecialidad(esp.id)}
              className={`p-3 sm:p-3.5 text-sm sm:text-base border rounded-xl transition-all duration-300 text-left sm:text-center shadow-sm hover:shadow-md ${
                data.especialidades.includes(esp.id) 
                ? 'border-[#1A5C3A] bg-[#f0f9f4] text-[#1A5C3A] font-bold' 
                : 'border-slate-200 text-slate-600 hover:border-[#1A5C3A]'
              }`}
            >
              {esp.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs sm:text-sm font-semibold text-slate-500">Sobre ti</label>
        <textarea 
          placeholder="Cuéntales a tus pacientes sobre tu enfoque y experiencia..." 
          className="w-full p-3.5 sm:p-4 text-sm sm:text-base border border-slate-200 rounded-xl h-28 sm:h-32 outline-none focus:ring-2 focus:ring-[#1A5C3A] transition resize-none" 
          value={data.bio}
          onChange={e => setData({...data, bio: e.target.value})} 
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4">
        <button 
          onClick={onBack} 
          className="w-full sm:w-1/3 p-3.5 sm:p-4 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Atrás
        </button>
        <button 
          onClick={validate} 
          className="w-full sm:w-2/3 bg-[#1A5C3A] text-white py-3.5 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#124229] transition shadow-sm"
        >
          Continuar <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
