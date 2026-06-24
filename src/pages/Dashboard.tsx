import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldAlert, ShieldCheck, ThermometerSnowflake, MapPin, Store, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendedores();
  }, []);

  const fetchVendedores = async () => {
    try {
      setLoading(true);
      // Traemos los vendedores con su última inspección usando una subconsulta de Supabase
      const { data, error } = await supabase
        .from('vendedores')
        .select(`
          *,
          inspecciones (
            temperatura_cadena_frio,
            estado_sanitario,
            fecha_inspeccion
          )
        `)
        .order('fecha_registro', { ascending: false });

      if (error) throw error;
      setVendedores(data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-10 w-10 text-emerald-600" />
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">PotaSegura</h1>
          </div>
          <p className="text-lg text-slate-600">Sistema de trazabilidad sanitaria y transparencia para vendedores de ceviche ambulante.</p>
        </header>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendedores.map((vendedor) => {
              // Obtenemos la inspección más reciente
              const ultimaInspeccion = vendedor.inspecciones && vendedor.inspecciones.length > 0 
                ? vendedor.inspecciones[vendedor.inspecciones.length - 1] 
                : null;
              
              const estado = ultimaInspeccion?.estado_sanitario || 'Sin inspección';
              
              // Definimos colores basados en el riesgo
              let bgRiesgo = "bg-slate-100";
              let textRiesgo = "text-slate-600";
              let IconRiesgo = Store;

              if (estado === 'Aprobado') {
                bgRiesgo = "bg-emerald-100 border-emerald-200"; textRiesgo = "text-emerald-700"; IconRiesgo = ShieldCheck;
              } else if (estado === 'Observado') {
                bgRiesgo = "bg-amber-100 border-amber-200"; textRiesgo = "text-amber-700"; IconRiesgo = AlertTriangle;
              } else if (estado === 'Clausurado') {
                bgRiesgo = "bg-red-100 border-red-200"; textRiesgo = "text-red-700"; IconRiesgo = ShieldAlert;
              }

              return (
                <div key={vendedor.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                  <div className={`p-4 border-b flex justify-between items-center ${bgRiesgo}`}>
                    <span className={`font-bold flex items-center gap-2 ${textRiesgo}`}>
                      <IconRiesgo className="h-5 w-5" />
                      {estado.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 bg-white rounded-md shadow-sm">
                      {vendedor.tiene_licencia ? '✅ Licencia' : '❌ Informal'}
                    </span>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{vendedor.nombre_puesto}</h3>
                    <p className="text-slate-500 text-sm mb-4">👤 Titular: {vendedor.titular}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                        <span>{vendedor.ubicacion}</span>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <ThermometerSnowflake className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                        <span>
                          Cadena de frío: 
                          <span className="font-bold ml-1">
                            {ultimaInspeccion ? `${ultimaInspeccion.temperatura_cadena_frio}°C` : 'No registrada'}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                        <span>
                          Transparencia (Pota): 
                          <span className={vendedor.transparencia_ingredientes ? "text-emerald-600 font-bold ml-1" : "text-red-600 font-bold ml-1"}>
                            {vendedor.transparencia_ingredientes ? 'Sí informa' : 'Engaño comercial'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
