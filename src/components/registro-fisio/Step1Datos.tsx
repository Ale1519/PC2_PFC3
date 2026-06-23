import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Step1Datos({ onNext }: any) {
  const [d, setD] = useState({ nombres: '', apellidos: '', email: '', celular: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [showPass, setShowPass] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'nombres' && !/^[a-zA-ZÁ-ÿ\s]+$/.test(value)) error = "Solo letras permitidas";
    if (name === 'apellidos' && !/^[a-zA-ZÁ-ÿ\s]+$/.test(value)) error = "Solo letras permitidas";
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Correo inválido";
    if (name === 'password' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) 
        error = "Mín. 8 caracteres, 1 mayús, 1 número, 1 especial (@$!%*?&)";
    
    setErrors({ ...errors, [name]: error });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setD({ ...d, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = () => {
    const todosLlenos = d.nombres && d.apellidos && d.email && d.celular && d.password;
    const sinErrores = Object.values(errors).every(e => e === '');

    if (todosLlenos && sinErrores) {
      onNext(d);
    } else {
      alert("Por favor, llena todos los campos y corrige los errores antes de continuar.");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Nombres */}
      <InputWithError 
        name="nombres" placeholder="Nombres" value={d.nombres} 
        onChange={handleInputChange} error={errors.nombres} 
      />
      
      {/* Apellidos */}
      <InputWithError 
        name="apellidos" placeholder="Apellidos" value={d.apellidos} 
        onChange={handleInputChange} error={errors.apellidos} 
      />

      {/* Correo */}
      <div className="space-y-1">
        <input 
          type="email" 
          name="email" 
          placeholder="Correo electrónico" 
          value={d.email} 
          className={`w-full p-3.5 sm:p-4 text-sm sm:text-base border rounded-xl outline-none focus:ring-2 focus:ring-[#0A1E3D] transition ${errors.email ? 'border-red-500' : 'border-slate-200'}`} 
          onChange={handleInputChange} 
        />
        {errors.email && (
          <div className="flex items-center gap-1 text-red-500 text-[11px] sm:text-xs px-1 mt-1">
              <AlertCircle className="h-3 w-3 shrink-0" /> {errors.email}
          </div>
        )}
      </div>
      
      {/* Celular con prefijo */}
      <div className="flex gap-2">
        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm sm:text-base text-slate-500 font-medium flex items-center justify-center shrink-0">
          +51
        </div>
        <input 
          type="tel"
          name="celular" 
          placeholder="Celular" 
          value={d.celular}
          className="w-full p-3.5 sm:p-4 text-sm sm:text-base border rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-[#0A1E3D] transition" 
          onChange={(e) => {
            const soloNumeros = e.target.value.replace(/\D/g, '');
            setD({...d, celular: soloNumeros});
          }} 
          maxLength={9}
        />
      </div>

      {/* Password con toggle centrado */}
      <div className="space-y-1">
        <div className="relative">
          <input 
            type={showPass ? 'text' : 'password'} 
            name="password" 
            placeholder="Contraseña" 
            value={d.password}
            className={`w-full p-3.5 sm:p-4 pr-12 text-sm sm:text-base border rounded-xl outline-none focus:ring-2 focus:ring-[#0A1E3D] transition ${errors.password ? 'border-red-500' : 'border-slate-200'}`} 
            onChange={handleInputChange} 
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
              {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <div className="flex items-start gap-1 text-red-500 text-[11px] sm:text-xs px-1 mt-1 leading-tight">
            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" /> 
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      <button 
        onClick={handleSubmit} 
        className="w-full bg-[#0A1E3D] text-white py-3.5 sm:py-4 text-sm sm:text-base rounded-xl font-bold mt-4 hover:bg-[#122d5a] transition"
      >
        Continuar
      </button>
    </div>
  );
}

// Componente auxiliar optimizado
function InputWithError({ name, placeholder, value, onChange, error }: any) {
  return (
    <div className="space-y-1">
      <input 
        name={name} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange}
        className={`w-full p-3.5 sm:p-4 text-sm sm:text-base border rounded-xl outline-none focus:ring-2 focus:ring-[#0A1E3D] transition ${error ? 'border-red-500' : 'border-slate-200'}`} 
      />
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-[11px] sm:text-xs px-1 mt-1">
            <AlertCircle className="h-3 w-3 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}
