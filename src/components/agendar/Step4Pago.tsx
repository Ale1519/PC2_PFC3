import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Check } from 'lucide-react';

export default function Step4Pago({ fisio, onNext, onBack }: any) {
  const [metodo, setMetodo] = useState<'yape' | 'tarjeta'>('yape');
  
  // Estado para el formulario de tarjeta (UI interactiva)
  const [tarjeta, setTarjeta] = useState({ numero: '', vencimiento: '', cvv: '', titular: '' });

  const handleConfirmar = () => {
    // Aquí podrías validar que los campos de tarjeta estén llenos si método === 'tarjeta'
    onNext({ metodo_pago: metodo });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0A1E3D]">Método de pago</h2>
        <p className="text-slate-500 text-sm mt-1">Total a pagar: <span className="font-bold text-[#0A1E3D]">S/ {fisio?.precio_sesion}</span></p>
      </div>

      {/* Selectores de Método */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setMetodo('yape')}
          className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all text-left ${
            metodo === 'yape' ? 'border-[#2B4B6F] bg-[#F4F7FB]' : 'border-slate-200 hover:border-[#2B4B6F]/50'
          }`}
        >
          <div className="h-10 w-10 bg-[#7B3487] rounded-lg flex items-center justify-center shrink-0">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-[#0A1E3D] text-sm">Yape</p>
            <p className="text-[10px] text-slate-500">Pago instantáneo</p>
          </div>
        </button>

        <button
          onClick={() => setMetodo('tarjeta')}
          className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all text-left ${
            metodo === 'tarjeta' ? 'border-[#2B4B6F] bg-[#F4F7FB]' : 'border-slate-200 hover:border-[#2B4B6F]/50'
          }`}
        >
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-[#0A1E3D] text-sm">Tarjeta</p>
            <p className="text-[10px] text-slate-500">Visa, Mastercard</p>
          </div>
        </button>
      </div>

      {/* Contenido Dinámico según Método */}
      <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-100 min-h-[200px] flex flex-col justify-center">
        
        {metodo === 'yape' ? (
          <div className="text-center space-y-3">
            <Smartphone className="h-8 w-8 text-[#0A1E3D] mx-auto opacity-80" />
            <div>
              <p className="text-[#0A1E3D] font-medium text-sm">Yapea al número <span className="font-bold text-[#2B4B6F]">+51 999 888 777</span></p>
              <p className="text-xs text-slate-500 mt-1">Confirmación automática en segundos</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Número de tarjeta</label>
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                value={tarjeta.numero}
                onChange={e => setTarjeta({...tarjeta, numero: e.target.value})}
                className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2B4B6F]" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Vencimiento</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  value={tarjeta.vencimiento}
                  onChange={e => setTarjeta({...tarjeta, vencimiento: e.target.value})}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2B4B6F]" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">CVV</label>
                <input 
                  type="text" 
                  placeholder="123" 
                  value={tarjeta.cvv}
                  onChange={e => setTarjeta({...tarjeta, cvv: e.target.value})}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2B4B6F]" 
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Botones */}
      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="font-bold text-sm flex items-center gap-2 text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="h-4 w-4" /> Atrás
        </button>
        <button 
          onClick={handleConfirmar} 
          className="bg-[#1A5C3A] hover:bg-[#124229] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          Confirmar pago <Check className="h-4 w-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
