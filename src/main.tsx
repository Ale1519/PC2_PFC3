import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

const PantallaBase = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6 text-center">
    <h1 className="text-3xl font-bold text-blue-600 mb-2"> Molde Activo</h1>
    <p className="text-gray-600 max-w-md">
      El Router está limpio y esperando. Crea tus archivos en <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">src/pages</code>, impórtalos arriba y registra las rutas.
    </p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      
      {/* Si decides usar un Navbar fijo para todas las vistas, impórtalo arriba y quítale el comentario a la línea de abajo: */}
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<PantallaBase />} />

        {/* --- AQUÍ ABAJO PEGARÁS TUS RUTAS  --- */}
        {/* <Route path="/ejemplo" element={<EjemploPage />} /> */}

      </Routes>
    </Router>
  </React.StrictMode>,
)
