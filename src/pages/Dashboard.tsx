import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, ThermometerSnowflake, 
  MapPin, Store, AlertTriangle, Plus, Search, 
  TrendingDown, AlertOctagon, Activity, Pencil 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchVendedores();
  }, []);

  const fetchVendedores = async () => {
    try {
      setLoading(true);
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

  const vendedoresFiltrados = vendedores.filter(v => 
    v.nombre_puesto.toLowerCase().includes(busqueda.toLowerCase()) || 
    v.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalClausurados = vendedores.filter(v => {
    const ultima = v.inspecciones?.[v.inspecciones.length - 1];
    return ultima?.estado_sanitario === 'Clausurado';
  }).length;

  const totalEngaños = vendedores.filter(v => v.transparencia_ingredientes === false).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-10 w-10 text-emerald-600" />
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">PotaSegura</h1>
            </div>
            <p className="text-lg text-slate-600">Centro de Monitoreo Sanitario de Cevicherías Ambulantes.</p>
          </div>
          
          <button 
            onClick={() => navigate('/registro')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Nueva Inspección
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Registrados</p>
              <p className="text-3xl font-black text-slate-800">{vendedores.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-red-100 p-4 rounded-xl text-red-600">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Puestos Clausurados</p>
              <p className="text-3xl font-black text-red-600">{totalClausurados}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-amber-100 p-4 rounded-xl text-amber-600">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Alertas de Engaño</p>
              <p className="text-3xl font-black text-amber-600">{totalEngaños}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre de carretilla o ubicación (Ej: Surco, Grau)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : vendedoresFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500 font-medium">No se encontraron resultados para "{busqueda}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendedoresFiltrados.map((vendedor) => {
              const ultimaInspeccion = vendedor.inspecciones && vendedor.inspecciones.length > 0 
                ? vendedor.inspecciones[vendedor.inspecciones.length - 1] 
                : null;
              
              const estado = ultimaInspeccion?.estado_sanitario || 'Sin inspección';
              
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
                    
                    <div className="space-y-3 mb-6">
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

                    {/* BOTÓN EDITAR */}
                    <button 
                      onClick={() => navigate(`/editar/${vendedor.id}`)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar Ficha
                    </button>
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
