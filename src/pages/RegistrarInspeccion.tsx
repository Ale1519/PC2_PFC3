import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ShieldAlert, ArrowLeft, Save } from 'lucide-react';

export default function RegistrarInspeccion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados del formulario Vendedor
  const [nombrePuesto, setNombrePuesto] = useState('');
  const [titular, setTitular] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tieneLicencia, setTieneLicencia] = useState('false'); // selector
  const [transparencia, setTransparencia] = useState('true');  // VENDRE POR DEFECTO EN TRUE ("Sí avisa")

  // Estados del formulario Inspección
  const [temperatura, setTemperatura] = useState('');
  const [estadoSanitario, setEstadoSanitario] = useState('Aprobado');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: vendedorData, error: errorVendedor } = await supabase
        .from('vendedores')
        .insert([{
          nombre_puesto: nombrePuesto,
          titular: titular,
          ubicacion: ubicacion,
          tiene_licencia: tieneLicencia === 'true',
          transparencia_ingredientes: transparencia === 'true', // Lee 'true' y lo pasa como booleano true
          usa_pota: true
        }])
        .select()
        .single();

      if (errorVendedor) throw errorVendedor;

      const { error: errorInspeccion } = await supabase
        .from('inspecciones')
        .insert([{
          vendedor_id: vendedorData.id,
          temperatura_cadena_frio: parseFloat(temperatura) || 0,
          estado_sanitario: estadoSanitario
        }]);

      if (errorInspeccion) throw errorInspeccion;

      navigate('/');

    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.message || 'Hubo un error al registrar los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-slate-500 hover:text-emerald-700 mb-6 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Panel
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-emerald-900 p-6 text-white flex items-center gap-3">
            <ClipboardList className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Nueva Inspección Sanitaria</h2>
              <p className="text-emerald-200 text-sm">Registro oficial de vendedores de ceviche ambulante.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3 text-red-700 text-sm">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* SECCIÓN 1: Datos del Puesto */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">1. Identificación del Puesto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Comercial (Carretilla)</label>
                  <input 
                    required type="text" value={nombrePuesto} onChange={(e) => setNombrePuesto(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Ej. El Huarique de la Pota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Titular</label>
                  <input 
                    required type="text" value={titular} onChange={(e) => setTitular(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación Frecuente</label>
                  <input 
                    required type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Ej. Esquina Av. Grau con Abancay"
                  />
                </div>

                {/* NUEVOS DESPLEGABLES GIGANTES */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Licencia Municipal</label>
                  <select 
                    value={tieneLicencia} onChange={(e) => setTieneLicencia(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                  >
                    <option value="false">❌ No tiene (Informal)</option>
                    <option value="true">✅ Sí tiene Licencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Transparencia con la Pota</label>
                  <select 
                    value={transparencia} onChange={(e) => setTransparencia(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                  >
                    <option value="true">🟢 Sí avisa que vende Pota</option>
                    <option value="false">🔴 Engaño (lo hace pasar por pescado)</option>
                  </select>
                </div>

              </div>
            </section>

            {/* SECCIÓN 2: Datos Sanitarios */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">2. Evaluación de Cadena de Frío</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Temperatura Registrada (°C)</label>
                  <input 
                    required type="number" step="0.1" value={temperatura} onChange={(e) => setTemperatura(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Ej. 4.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Dictamen Sanitario</label>
                  <select 
                    value={estadoSanitario} onChange={(e) => setEstadoSanitario(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                  >
                    <option value="Aprobado">🟢 Aprobado (Bajo Riesgo)</option>
                    <option value="Observado">🟡 Observado (Riesgo Moderado)</option>
                    <option value="Clausurado">🔴 Clausurado (Alto Riesgo)</option>
                  </select>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <span className="animate-pulse">Guardando en base de datos...</span>
              ) : (
                <><Save className="h-5 w-5" /> Registrar y Guardar Inspección</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
