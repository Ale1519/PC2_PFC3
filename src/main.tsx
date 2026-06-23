import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import './index.css'

const PantallaBase = () => {
  const [datos, setDatos] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Intentamos leer la tabla "prueba" que creamos en Supabase
        const { data, error } = await supabase.from('prueba').select('*')
        if (error) throw error
        setDatos(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    obtenerDatos()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">🚀 Validando Circuito Completo</h1>
      
      {cargando && <p className="text-gray-500 animate-pulse">Consultando a Supabase...</p>}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md border border-red-200">
          <p className="font-bold">❌ Error en la conexión:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {!cargando && !error && datos.length === 0 && (
        <p className="text-yellow-600 font-medium">Conectado a Supabase, pero la tabla no tiene filas.</p>
      )}

      {!cargando && !error && datos.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
          <p className="text-green-600 font-bold mb-4 flex items-center justify-center gap-2">
            <span>✅</span> ¡Conexión Exitosa entre Vercel y Supabase!
          </p>
          <div className="text-left space-y-2">
            {datos.map((item) => (
              <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                <span className="font-bold text-gray-400 mr-2">#{item.id}</span>
                <span className="text-gray-700">{item.texto}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<PantallaBase />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
