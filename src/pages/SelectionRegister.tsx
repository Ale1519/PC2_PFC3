import { useNavigate } from 'react-router-dom';
import { User, Activity, ArrowLeft } from 'lucide-react';

export default function SelectionRegister() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100dvh-5rem)] sm:min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 pb-20 sm:pb-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3D] mb-6 sm:mb-8 text-center">¿Cómo deseas unirte?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
        {/* Opción Paciente */}
        <button 
          onClick={() => navigate('/registro-paciente')}
          className="bg-white p-6 sm:p-8 rounded-[1.5rem] border-2 border-transparent shadow-sm hover:shadow-md hover:border-[#0A1E3D] transition-all duration-300 text-left group"
        >
          <div className="bg-sky-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <User className="h-6 w-6 text-sky-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3D]">Soy Paciente</h3>
          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">Busco fisioterapeutas para mejorar mi salud y bienestar.</p>
        </button>

        {/* Opción Fisioterapeuta */}
        <button 
          onClick={() => navigate('/registro-fisio')}
          className="bg-white p-6 sm:p-8 rounded-[1.5rem] border-2 border-transparent shadow-sm hover:shadow-md hover:border-[#1A6645] transition-all duration-300 text-left group"
        >
          <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <Activity className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3D]">Soy Fisioterapeuta</h3>
          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">Quiero ofrecer mis servicios y gestionar mis pacientes.</p>
        </button>
      </div>

      <button onClick={() => navigate('/')} className="mt-8 text-slate-500 flex items-center gap-2 hover:text-[#0A1E3D] transition hover:underline text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </button>
    </div>
  );
}
