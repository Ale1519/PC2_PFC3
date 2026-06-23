import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Fisioterapeuta {
  id: number;
  nombre: string;
  genero: 'Dra.' | 'Lic.';
  sexo: 'Femenino' | 'Masculino';
  colegiatura: string;
  rating: number;
  resenas: number;
  precio: number;
  especialidades: string[];
  modalidades: string[]; 
  distritos: string[];
}

// Interfaz corregida adaptada a tu esquema exacto de Supabase
interface DistritoDB {
  id: string; // Cambiado a string porque tu ID es un UUID
  nombre: string;
}

export function useEspecialistas() {
  // Datos Mock base de la aplicación
  const listaEspecialistasMock: Fisioterapeuta[] = [
    {
      id: 1,
      nombre: "Lucía Mendoza",
      genero: "Dra.",
      sexo: "Femenino",
      colegiatura: "CFTP-12345",
      rating: 4.9,
      resenas: 87,
      precio: 120,
      especialidades: ["Traumatológica", "Deportiva"],
      modalidades: ["Domicilio", "Online"],
      distritos: ["Miraflores", "San Isidro"]
    },
    {
      id: 2,
      nombre: "Diego Fernández",
      genero: "Lic.",
      sexo: "Masculino",
      colegiatura: "CFTP-23456",
      rating: 4.7,
      resenas: 62,
      precio: 90,
      especialidades: ["Deportiva", "Dolor crónico"],
      modalidades: ["Domicilio"],
      distritos: ["Surco", "La Molina"]
    },
    {
      id: 3,
      nombre: "Patricia Quispe",
      genero: "Lic.",
      sexo: "Femenino",
      colegiatura: "CFTP-34567",
      rating: 5.0,
      resenas: 134,
      precio: 110,
      especialidades: ["Neurológica", "Geriátrica"],
      modalidades: ["Domicilio", "Online"],
      distritos: ["San Isidro", "Miraflores"]
    },
    {
      id: 4,
      nombre: "Carlos Vásquez",
      genero: "Lic.",
      sexo: "Masculino",
      colegiatura: "CFTP-45678",
      rating: 4.6,
      resenas: 45,
      precio: 100,
      especialidades: ["Postoperatoria", "Traumatológica"],
      modalidades: ["Online"],
      distritos: ["Los Olivos", "San Martín de Porres"]
    },
    {
      id: 5,
      nombre: "Andrea Salazar",
      genero: "Dra.",
      sexo: "Femenino",
      colegiatura: "CFTP-56789",
      rating: 4.9,
      resenas: 98,
      precio: 130,
      especialidades: ["Pediátrica", "Respiratoria"],
      modalidades: ["Domicilio", "Online"],
      distritos: ["Miraflores", "San Borja"]
    },
    {
      id: 6,
      nombre: "Renato Ríos",
      genero: "Lic.",
      sexo: "Masculino",
      colegiatura: "CFTP-67890",
      rating: 4.3,
      resenas: 18,
      precio: 70,
      especialidades: ["Deportiva", "Traumatológica"],
      modalidades: ["Domicilio"],
      distritos: ["Chorrillos", "Barranco"]
    }
  ];

  // Estados de los filtros reactivos
  const [busqueda, setBusqueda] = useState('');
  const [modalidad, setModalidad] = useState<'todos' | 'Domicilio' | 'Online' | 'ambos'>('todos');
  const [filtroGenero, setFiltroGenero] = useState<'todos' | 'Femenino' | 'Masculino'>('todos');
  const [distrito, setDistrito] = useState('todos');
  const [precioMax, setPrecioMax] = useState(200);
  const [calificacionMin, setCalificacionMin] = useState<number | null>(null);

  // Estados de persistencia
  const [distritosDB, setDistritosDB] = useState<DistritoDB[]>([]);
  const [listaEspecialistas] = useState<Fisioterapeuta[]>(listaEspecialistasMock);

  // Carga asíncrona adaptada a las dos columnas reales de tu tabla de Supabase
  useEffect(() => {
    async function cargarDistritos() {
      try {
        const { data, error } = await supabase
          .from('distritos')
          .select('id, nombre') // Eliminado 'slug' porque tu tabla solo tiene id y nombre
          .order('nombre', { ascending: true });

        if (!error && data && data.length > 0) {
          setDistritosDB(data);
        } 
      } catch (err) {
        console.error('Error conectando a la tabla de Supabase:', err);
      }
    }

    cargarDistritos();
  }, []);

  // Motor lógico del Filtrado Reactivo
  const especialistasFiltrados = useMemo(() => {
    return listaEspecialistas.filter((fisio) => {
      const cumpleBusqueda = 
        fisio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        fisio.especialidades.some(esp => esp.toLowerCase().includes(busqueda.toLowerCase()));

      let cumpleModalidad = true;
      if (modalidad === 'Domicilio') {
        cumpleModalidad = fisio.modalidades.includes('Domicilio');
      } else if (modalidad === 'Online') {
        cumpleModalidad = fisio.modalidades.includes('Online');
      } else if (modalidad === 'ambos') {
        cumpleModalidad = fisio.modalidades.includes('Domicilio') && fisio.modalidades.includes('Online');
      }

      const cumpleGenero = filtroGenero === 'todos' || fisio.sexo === filtroGenero;
      
      // En la lista de especialistas usamos el string del nombre para contrastar con el selector
      const cumpleDistrito = distrito === 'todos' || fisio.distritos.includes(distrito);
      const cumplePrecio = fisio.precio <= precioMax;
      const cumpleRating = calificacionMin === null || fisio.rating >= calificacionMin;

      return cumpleBusqueda && cumpleModalidad && cumpleGenero && cumpleDistrito && cumplePrecio && cumpleRating;
    });
  }, [busqueda, modalidad, filtroGenero, distrito, precioMax, calificacionMin, listaEspecialistas]);

  return {
    busqueda,
    setBusqueda,
    modalidad,
    setModalidad,
    filtroGenero,
    setFiltroGenero,
    distrito,
    setDistrito,
    precioMax,
    setPrecioMax,
    calificacionMin,
    setCalificacionMin,
    distritosDB,
    especialistasFiltrados
  };
}