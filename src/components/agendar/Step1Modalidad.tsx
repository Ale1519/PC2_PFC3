import { useState } from 'react';
import { Home as HomeIcon, Video, MapPin } from 'lucide-react';

export default function Step1Modalidad({ fisio, data, onNext }: any) {
  const [modalidad, setModalidad] = useState(data.modalidad || '');
  const [distritoId, setDistritoId] = useState(data.distrito_id || '');
  const [direccion, setDireccion] = useState(data.direccion_exacta || '');

  // Extraemos SOLO los distritos que este fisio atiende
  const distritosDelFisio = fisio?.fisioterapeuta_distritos?.map((fd: any) => fd.distritos) || [];

  // Validación en tiempo real:
  const isValido = modalidad === 'videollamada' || 
                   (modalidad === 'domicilio' && distritoId !== '' && direccion.trim() !== '');

  const handleContinue = () => {
    onNext({
      modalidad,
      distrito_id: modalidad === 'domicilio' ? distritoId : null,
      direccion_exacta: modalidad === 'domicilio' ? direccion : null
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0A1E3D]">Elige la modalidad</h2>
        <p className="text-slate-500 text-sm mt-1">¿Cómo prefieres tu sesión?</p>
      </div>

      {/* Botones de Selección de Modalidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          disabled={!fisio?.ofrece_domicilio}
          onClick={() => setModalidad('domicilio')}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${
            !fisio?.ofrece_domicilio ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50' :
            modalidad === 'domicilio' ? 'border-[#1A5C3A] bg-[#f0f9f4]' : 'border-slate-200 hover:border-[#1A5C3A]/50'
          }`}
        >
          <HomeIcon className={`h-8 w-8 mb-4 ${modalidad === 'domicilio' ? 'text-[#1A5C3A]' : 'text-[#0A1E3D]'}`} />
          <h4 className="font-bold text-[#0A1E3D] mb-1">A domicilio</h4>
          <p className="text-xs text-slate-500">El fisio va a tu casa en Lima.</p>
          {!fisio?.ofrece_domicilio && <p className="text-[10px] text-red-400 mt-2 font-medium">No disponible por este profesional</p>}
        </button>

        <button
          disabled={!fisio?.ofrece_videollamada}
          onClick={() => setModalidad('videollamada')}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${
            !fisio?.ofrece_videollamada ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50' :
            modalidad === 'videollamada' ? 'border-[#1A5C3A] bg-[#f0f9f4]' : 'border-slate-200 hover:border-[#1A5C3A]/50'
          }`}
        >
          <Video className={`h-8 w-8 mb-4 ${modalidad === 'videollamada' ? 'text-[#1A5C3A]' : 'text-[#0A1E3D]'}`} />
          <h4 className="font-bold text-[#0A1E3D] mb-1">Videollamada</h4>
          <p className="text-xs text-slate-500">Sesión online desde donde estés.</p>
          {!fisio?.ofrece_videollamada && <p className="text-[10px] text-red-400 mt-2 font-medium">No disponible por este profesional</p>}
        </button>
      </div>

      {/* FORMULARIO DE DIRECCIÓN */}
      {modalidad === 'domicilio' && (
        <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
          <h3 className="font-bold text-[#0A1E3D] text-sm flex items-center gap-2 uppercase tracking-wider text-slate-400">
            <MapPin className="h-4 w-4 text-[#1A5C3A]" /> Dirección de atención
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Distrito</label>
              <select
                value={distritoId}
                onChange={(e) => setDistritoId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#1A5C3A] focus:bg-white transition"
              >
                <option value="">Selecciona tu distrito</option>
                {distritosDelFisio.map((d: any) => (
                  <option key={d?.id} value={d?.id}>{d?.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Dirección exacta</label>
              <input
                type="text"
                placeholder="Ej. Av. Primavera 456, Dpto 201"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#1A5C3A] focus:bg-white transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* Botón de navegación */}
      <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
        <button 
          onClick={handleContinue}
          disabled={!isValido}
          className="bg-[#6B8A9E] hover:bg-[#5a7689] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
