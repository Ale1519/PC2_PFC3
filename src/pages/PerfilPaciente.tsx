import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Phone, Save, ArrowLeft, CheckCircle2, UserCircle } from 'lucide-react';

export default function PerfilPaciente() {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null);

  // Estados del formulario
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: paciente } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id', user.id)
          .single();

        if (paciente) {
          setNombreCompleto(paciente.nombre_completo || '');
          setTelefono(paciente.telefono || '');
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa");

      const { error } = await supabase
        .from('pacientes')
        .update({
          nombre_completo: nombreCompleto,
          telefono: telefono,
        })
        .eq('id', user.id);

      if (error) throw error;

      setMensaje({ tipo: 'exito', texto: '¡Perfil actualizado correctamente!' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);

    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: 'Hubo un problema al guardar: ' + error.message });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A5C3A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ENCABEZADO Y NAVEGACIÓN */}
        <div className="mb-8">
          <Link to="/dashboard-paciente" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1A5C3A] font-medium transition mb-6">
            <ArrowLeft className="h-4 w-4" /> Volver a mi panel
          </Link>
          <h1 className="text-3xl font-extrabold text-[#0A1E3D]">Mi Perfil</h1>
          <p className="text-slate-500 mt-1">Actualiza tus datos personales para que tus especialistas puedan contactarte.</p>
        </div>

        {/* TARJETA DEL FORMULARIO */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Cabecera visual del perfil */}
          <div className="bg-gradient-to-r from-[#0A1E3D] to-[#122d5a] px-8 py-10 text-center relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg text-[#0A1E3D] mb-4">
                <UserCircle className="h-16 w-16" strokeWidth={1} />
              </div>
              <h2 className="text-xl font-bold text-white capitalize">{nombreCompleto || 'Paciente'}</h2>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={guardarCambios} className="p-8 space-y-6">
            
            {/* Mensajes de Alerta */}
            {mensaje && (
              <div className={`p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${
                mensaje.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {mensaje.tipo === 'exito' && <CheckCircle2 className="h-5 w-5" />}
                <p className="text-sm font-bold">{mensaje.texto}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Nombre Completo */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" /> Nombre y Apellidos
                </label>
                <input
                  type="text"
                  required
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#1A5C3A] focus:bg-white transition"
                />
              </div>

              {/* Campo Teléfono */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" /> Número de Teléfono
                </label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 987654321"
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#1A5C3A] focus:bg-white transition"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={guardando}
                className="bg-[#1A5C3A] hover:bg-[#124229] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {guardando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
