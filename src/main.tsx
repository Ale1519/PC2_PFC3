import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RegistrarInspeccion from './pages/RegistrarInspeccion'
import EditarVendedor from './pages/EditarVendedor'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/registro" element={<RegistrarInspeccion />} />
        <Route path="/editar/:id" element={<EditarVendedor />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
