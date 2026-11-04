import React, { useState, useEffect } from 'react';

const INITIAL_DATA = {
  gruposRazas: [
    { id: 101, nombre: 'Raza Brahman', descripcion: 'Resistente al clima cálido y parásitos.', icono: '🐂' },
    { id: 102, nombre: 'Raza Nelore', descripcion: 'Excelente para producción de carne y robustez.', icono: '🐃' },
    { id: 103, nombre: 'Raza Gyr', descripcion: 'Alta producción lechera en clima tropical.', icono: '🐄' },
    { id: 104, nombre: 'Raza Brangus', descripcion: 'Excelente combinación de rusticidad y calidad cárnica.', icono: '🐂' },
    { id: 105, nombre: 'Raza Angus', descripcion: 'Reconocida mundialmente por su alta calidad de carne.', icono: '🐃' },
    { id: 106, nombre: 'Raza Limousin', descripcion: 'Gran musculatura y rendimiento en canal.', icono: '🐄' },
    { id: 107, nombre: 'Raza Senepol', descripcion: 'Tolerancia al calor extremo y resistencia natural a parásitos.', icono: '🐂' }
  ],
  animales: [
    {
      id: 'internal-001',
      codigo: '1',
      grupoId: 101,
      fechaNacimiento: '2022-03-15',
      pesoActual: 450,
      estado: 'Saludable',
      historialPesos: [
        { fecha: '2023-01-10', peso: 280 },
        { fecha: '2023-08-20', peso: 370 },
        { fecha: '2024-02-15', peso: 450 }
      ],
      vacunas: [
        { id: 1, vacuna: 'Rabia bovina', fecha: '2025-01-10', dosis: '2 ml' },
        { id: 2, vacuna: 'Ivermectina', fecha: '2025-10-01', dosis: '10 ml' }
      ]
    }
  ]
};

const VADEMECUM_MEDICAMENTOS = [
  // Vacunas Bovinas (15)
  { nombre: 'Brucelosis Cepa 19', tipo: 'Vacuna Anual', desc: 'Previene la brucelosis bovina en hembras jóvenes, protegiendo contra abortos y problemas de fertilidad.' },
  { nombre: 'Brucelosis RB51', tipo: 'Vacuna Anual', desc: 'Vacuna alternativa contra la brucelosis que no interfiere con las pruebas de diagnóstico oficiales del hato.' },
  { nombre: 'Rabia bovina', tipo: 'Vacuna Anual', desc: 'Inmunización obligatoria contra el virus rábico transmitido por mordeduras de murciélagos hematófagos.' },
  { nombre: 'Carbunco bacteridiano', tipo: 'Vacuna Anual', desc: 'Previene la fiebre carbonosa, una enfermedad infecciosa aguda y altamente mortal en rumiantes.' },
  { nombre: 'Carbunco sintomático', tipo: 'Vacuna Anual', desc: 'Protege contra la mancha o pierna negra, afectando comúnmente a animales jóvenes en crecimiento.' },
  { nombre: 'Edema maligno', tipo: 'Vacuna Anual', desc: 'Inmuniza contra infecciones clostridiales agudas asociadas a heridas o traumatismos en el campo.' },
  { nombre: 'Enterotoxemia', tipo: 'Vacuna Anual', desc: 'Previene la enfermedad del riñón pulposo en animales sometidos a dietas ricas o cambios bruscos.' },
  { nombre: 'Botulismo', tipo: 'Vacuna Anual', desc: 'Protege contra neurotoxinas bacterianas presentes en pasturas o fuentes de agua con materia orgánica.' },
  { nombre: 'IBR', tipo: 'Vacuna Anual', desc: 'Rinotraqueítis Infecciosa Bovina; previene cuadros respiratorios graves y fallas reproductivas.' },
  { nombre: 'DVB (BVD)', tipo: 'Vacuna Anual', desc: 'Diarrea Viral Bovina; protege la inmunidad general y el rendimiento reproductivo del ganado.' },
  { nombre: 'PI3', tipo: 'Vacuna Anual', desc: 'Parainfluenza bovina; ayuda a prevenir infecciones virales del tracto respiratorio superior.' },
  { nombre: 'BRSV', tipo: 'Vacuna Anual', desc: 'Virus Sincitial Respiratorio Bovino; evita complicaciones pulmonares severas en terneros.' },
  { nombre: 'Leptospirosis', tipo: 'Vacuna Anual', desc: 'Previene infecciones bacterianas renales y reproductivas propagadas por roedores y aguas estancadas.' },
  { nombre: 'Pasteurelosis', tipo: 'Vacuna Anual', desc: 'Protege contra la fiebre de embarque y procesos neumónicos asociados al estrés por traslado.' },
  { nombre: 'Mannheimiosis', tipo: 'Vacuna Anual', desc: 'Inmuniza contra afecciones pulmonares graves comunes en ganado de engorde y recría.' },

  // Antiparasitarios y Garrapaticidas (15)
  { nombre: 'Ivermectina', tipo: 'Antiparasitario', desc: 'Endectocida de amplio espectro para el control de parásitos gastrointestinales y parásitos externos.' },
  { nombre: 'Doramectina', tipo: 'Antiparasitario', desc: 'Antiparasitario de larga acción muy eficaz contra gusaneras, garrapatas y nemátodos internos.' },
  { nombre: 'Albendazol', tipo: 'Antiparasitario', desc: 'Antihelmíntico oral efectivo frente a parásitos gastrointestinales, pulmonares y tenias.' },
  { nombre: 'Fenbendazol', tipo: 'Antiparasitario', desc: 'Controla de manera eficiente estadios adultos y larvarios de lombrices redondas y planas.' },
  { nombre: 'Levamisol', tipo: 'Antiparasitario', desc: 'Antihelmíntico que ayuda a eliminar parásitos pulmonares y gástricos estimulando la inmunidad.' },
  { nombre: 'Closantel', tipo: 'Antiparasitario', desc: 'Especial para el control de parásitos hematófagos chupadores de sangre y Fasciola hepática.' },
  { nombre: 'Eprinomectina', tipo: 'Antiparasitario', desc: 'Endectocida pour-on sin período de retiro en leche, ideal para vacas lecheras y ganado de carne.' },
  { nombre: 'Moxidectina', tipo: 'Antiparasitario', desc: 'Macrolida endectocida caracterizada por su prolongada persistencia protectora en pastoreo.' },
  { nombre: 'Nitroxinil', tipo: 'Antiparasitario', desc: 'Fasciolicida y controlador activo de parásitos gástricos que consumen sangre.' },
  { nombre: 'Triclabendazol', tipo: 'Antiparasitario', desc: 'Tratamiento específico de alta potencia contra Fasciola hepática en todas sus etapas evolutivas.' },
  { nombre: 'Oxfendazol', tipo: 'Antiparasitario', desc: 'Benzimidazol que ofrece gran eficacia en el control de lombrices gastrointestinales.' },
  { nombre: 'Amitraz', tipo: 'Antiparasitario / Baño', desc: 'Garrapaticida, sarnicida y piojicida de contacto aplicado mediante baños de inmersión o aspersión.' },
  { nombre: 'Cipermetrina', tipo: 'Antiparasitario / Baño', desc: 'Piretroide sintético diseñado para el control rápido de moscas, garrapatas y piojos en el hato.' },
  { nombre: 'Fluazurón', tipo: 'Antiparasitario', desc: 'Regulador de crecimiento de insectos (inhibidor de quitina) para un control duradero de garrapatas.' },
  { nombre: 'Fipronil', tipo: 'Antiparasitario', desc: 'Producto de alta persistencia contra garrapatas, moscas de los cuernos y bicheras o Nuches.' }
];

const LISTA_VACUNAS_ANUALES = VADEMECUM_MEDICAMENTOS.filter(m => m.tipo === 'Vacuna Anual').map(m => m.nombre);
const LISTA_CONTROL_PARASITARIO = VADEMECUM_MEDICAMENTOS.filter(m => m.tipo.includes('Antiparasitario')).map(m => m.nombre);

const calcularEdad = (fechaNac) => {
  const nac = new Date(fechaNac);
  const hoy = new Date();
  let meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth());
  if (hoy.getDate() < nac.getDate()) meses--;
  const años = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;
  return `${años > 0 ? `${años} año(s) ` : ''}${mesesRestantes} mes(es)`;
};

const evaluarAlertaInteligente = (nombreProducto, fechaAplicacion) => {
  const hoy = new Date();
  const fechaApp = new Date(fechaAplicacion);
  const diferenciaDias = Math.floor((hoy - fechaApp) / (1000 * 60 * 60 * 24));

  const esAnual = LISTA_VACUNAS_ANUALES.some(v => v.toLowerCase() === nombreProducto.toLowerCase());
  const esParasito = LISTA_CONTROL_PARASITARIO.some(p => p.toLowerCase() === nombreProducto.toLowerCase());

  if (esAnual) {
    if (diferenciaDias > 330) {
      return { texto: `⚠️ Refuerzo Anual Vencido (${diferenciaDias} días)`, colorBg: '#fef2f2', colorTxt: '#dc2626', borde: '#fecaca' };
    } else if (diferenciaDias > 270) {
      return { texto: `⚡ Próximo a vencer (${diferenciaDias} días)`, colorBg: '#fef3c7', colorTxt: '#d97706', borde: '#fde68a' };
    } else {
      return { texto: `✅ Vacuna al día (${diferenciaDias} días)`, colorBg: '#ecfdf5', colorTxt: '#059669', borde: '#a7f3d0' };
    }
  } else if (esParasito) {
    if (diferenciaDias > 120) {
      return { texto: `⚠️ Nuevo Baño/Dosis Necesaria (${diferenciaDias} días)`, colorBg: '#fef2f2', colorTxt: '#dc2626', borde: '#fecaca' };
    } else if (diferenciaDias > 90) {
      return { texto: `⚡ Control próximo (${diferenciaDias} días)`, colorBg: '#fef3c7', colorTxt: '#d97706', borde: '#fde68a' };
    } else {
      return { texto: `✅ Protección activa (${diferenciaDias} días)`, colorBg: '#ecfdf5', colorTxt: '#059669', borde: '#a7f3d0' };
    }
  } else {
    return { texto: `🛡️ Tratamiento único (${diferenciaDias} días)`, colorBg: '#eff6ff', colorTxt: '#1d4ed8', borde: '#bfdbfe' };
  }
};

export default function App() {
  const [datos, setDatos] = useState(() => {
    const datosGuardados = localStorage.getItem('ganado_facil_datos');
    if (datosGuardados) {
      try { return JSON.parse(datosGuardados); } catch (e) { console.error(e); }
    }
    return INITIAL_DATA;
  });

  const [vistaActual, setVistaActual] = useState('INICIO');
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [animalSeleccionadoId, setAnimalSeleccionadoId] = useState(null);
  const [busquedaCodigo, setBusquedaCodigo] = useState('');

  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoPeso, setNuevoPeso] = useState('');
  const [nuevaFechaNac, setNuevaFechaNac] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('Saludable');

  const [mostrarModalActualizar, setMostrarModalActualizar] = useState(false);
  const [pesoNuevoRegistro, setPesoNuevoRegistro] = useState('');
  const [estadoNuevoRegistro, setEstadoNuevoRegistro] = useState('');

  const [mostrarModalVacuna, setMostrarModalVacuna] = useState(false);
  const [nombreVacuna, setNombreVacuna] = useState('');
  const [fechaVacuna, setFechaVacuna] = useState('');
  const [dosisVacuna, setDosisVacuna] = useState('');

  useEffect(() => {
    localStorage.setItem('ganado_facil_datos', JSON.stringify(datos));
  }, [datos]);

  const animalSeleccionado = datos.animales.find(a => a.id === animalSeleccionadoId);

  const obtenerAnimalesDelGrupo = () => {
    if (!grupoSeleccionado) return [];
    return datos.animales.filter(a => {
      const perteneceAlGrupo = a.grupoId === grupoSeleccionado.id;
      const coincideCodigo = busquedaCodigo === '' || a.codigo.toString().includes(busquedaCodigo.trim());
      return perteneceAlGrupo && coincideCodigo;
    });
  };

  const abrirModalNuevoAnimal = () => {
    setNuevoCodigo('');
    setNuevoPeso('');
    setNuevaFechaNac('');
    setNuevoEstado('Saludable');
    setMostrarModalNuevo(true);
  };

  const manejarAgregarAnimal = (e) => {
    e.preventDefault();
    if (!nuevoCodigo || !nuevoPeso || !nuevaFechaNac) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const codigoLimpio = nuevoCodigo.trim();
    const codigoExistente = datos.animales.some(
      a => a.grupoId === grupoSeleccionado.id && a.codigo.toLowerCase() === codigoLimpio.toLowerCase()
    );

    if (codigoExistente) {
      alert(`⚠️ El código "${codigoLimpio}" ya está registrado en este grupo.`);
      return;
    }

    const nuevoAnimal = {
      id: 'internal-' + Date.now(),
      codigo: codigoLimpio,
      grupoId: grupoSeleccionado.id,
      fechaNacimiento: nuevaFechaNac,
      pesoActual: Number(nuevoPeso),
      estado: nuevoEstado,
      historialPesos: [{ fecha: new Date().toISOString().split('T')[0], peso: Number(nuevoPeso) }],
      vacunas: []
    };

    setDatos(prev => ({ ...prev, animales: [nuevoAnimal, ...prev.animales] }));
    setMostrarModalNuevo(false);
  };

  const manejarActualizarAnimal = (e) => {
    e.preventDefault();
    const fechaHoy = new Date().toISOString().split('T')[0];
    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => {
        if (a.id === animalSeleccionadoId) {
          const pesoNum = pesoNuevoRegistro ? Number(pesoNuevoRegistro) : a.pesoActual;
          const nuevoHistorial = pesoNuevoRegistro 
            ? [...a.historialPesos, { fecha: fechaHoy, peso: pesoNum }]
            : a.historialPesos;
          return {
            ...a,
            pesoActual: pesoNum,
            estado: estadoNuevoRegistro || a.estado,
            historialPesos: nuevoHistorial
          };
        }
        return a;
      })
    }));
    setMostrarModalActualizar(false);
  };

  const manejarAgregarVacuna = (e) => {
    e.preventDefault();
    if (!nombreVacuna || !fechaVacuna || !dosisVacuna) {
      alert('Por favor complete los detalles del tratamiento.');
      return;
    }
    const nuevaVacunaObj = {
      id: Date.now(),
      vacuna: nombreVacuna.trim(),
      fecha: fechaVacuna,
      dosis: dosisVacuna.trim()
    };

    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => {
        if (a.id === animalSeleccionadoId) {
          return { ...a, vacunas: [...a.vacunas, nuevaVacunaObj] };
        }
        return a;
      })
    }));

    setNombreVacuna('');
    setFechaVacuna('');
    setDosisVacuna('');
    setMostrarModalVacuna(false);
  };

  const eliminarAnimal = (idAnimal) => {
    if (window.confirm('¿Está seguro de eliminar este animal del registro?')) {
      setDatos(prev => ({ ...prev, animales: prev.animales.filter(a => a.id !== idAnimal) }));
      setVistaActual('ANIMALES');
      setAnimalSeleccionadoId(null);
    }
  };

  const generarPDF = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🐂</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Ganado Fácil 🌾</h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#a7f3d0' }}>Control Pecuario Profesional</p>
          </div>
        </div>
        {vistaActual !== 'INICIO' && (
          <button 
            className="no-print"
            onClick={() => {
              if (vistaActual === 'FICHA') setVistaActual('ANIMALES');
              else if (vistaActual === 'ANIMALES' || vistaActual === 'GUIA') setVistaActual('INICIO');
              else setVistaActual('INICIO');
            }}
            style={{ background: '#065f46', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
          >
            ← Volver
          </button>
        )}
      </header>

      <main style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {vistaActual === 'INICIO' && (
          <>
            <div className="card-box" style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', textAlign: 'center' }}>
              <span style={{ fontSize: '40px' }}>🏡 🐄</span>
              <h2 style={{ fontSize: '18px', margin: '8px 0', color: 'white' }}>¡Bienvenido a su Finca!</h2>
              <p style={{ fontSize: '12px', color: '#e6fffa', marginBottom: '16px' }}>
                Gestione de forma limpia y moderna el peso, la salud y los registros de su ganado por razas.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button className="btn-primary" style={{ background: 'white', color: '#065f46', flex: 1 }} onClick={() => setVistaActual('GRUPOS')}>
                  Ver Razas 📋
                </button>
                <button className="btn-primary" style={{ background: '#047857', border: '1px solid #a7f3d0', color: 'white', flex: 1 }} onClick={() => setVistaActual('GUIA')}>
                  Guía Sanitaria 🛡️
                </button>
              </div>
            </div>

            <div className="card-box">
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#047857', marginBottom: '12px', textAlign: 'center', margin: '0 0 12px 0' }}>
                📊 Resumen General del Hato
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'center' }}>
                <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                  <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#047857', margin: 0 }}>{datos.gruposRazas.length}</p>
                  <p style={{ fontSize: '11px', color: '#475569', margin: '4px 0 0 0' }}>Razas 🧬</p>
                </div>
                <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                  <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#047857', margin: 0 }}>{datos.animales.length}</p>
                  <p style={{ fontSize: '11px', color: '#475569', margin: '4px 0 0 0' }}>Animales 🐂</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* VISTA DE GUÍA SANITARIA ORGANIZADA POR DESCRIPCIÓN (SIN BUSCADOR) */}
        {vistaActual === 'GUIA' && (
          <>
            <div className="card-box" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', textAlign: 'center' }}>
              <h2 style={{ fontSize: '15px', textTransform: 'uppercase', color: '#047857', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                🛡️ Guía Sanitaria y Medicamentos
              </h2>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                Manual de consulta con la descripción y propósito de cada vacuna y antiparasitario del sistema.
              </p>
            </div>

            <div className="card-box">
              <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#047857', borderBottom: '2px solid #a7f3d0', paddingBottom: '6px', marginBottom: '12px', fontWeight: 'bold' }}>
                🛡️ Vacunas Bovinas (Plan Anual)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {VADEMECUM_MEDICAMENTOS.filter(m => m.tipo === 'Vacuna Anual').map((med, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>🧪 {med.nombre}</span>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '6px', background: '#d1fae5', color: '#065f46' }}>
                        {med.tipo}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.4' }}>
                      {med.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-box">
              <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#0369a1', borderBottom: '2px solid #bae6fd', paddingBottom: '6px', marginBottom: '12px', fontWeight: 'bold' }}>
                🧴 Antiparasitarios y Garrapaticidas
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {VADEMECUM_MEDICAMENTOS.filter(m => m.tipo.includes('Antiparasitario')).map((med, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>🧪 {med.nombre}</span>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '6px', background: '#e0f2fe', color: '#0369a1' }}>
                        {med.tipo}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.4' }}>
                      {med.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {vistaActual === 'GRUPOS' && (
          <>
            <h2 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#047857', margin: '0 0 4px 0', fontWeight: 'bold' }}>
              🧬 Razas Disponibles (7 en total)
            </h2>
            {datos.gruposRazas.map((grupo) => {
              const count = datos.animales.filter(a => a.grupoId === grupo.id).length;
              return (
                <div 
                  key={grupo.id} 
                  className="card-box" 
                  onClick={() => { setGrupoSeleccionado(grupo); setBusquedaCodigo(''); setVistaActual('ANIMALES'); }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{grupo.icono} {grupo.nombre}</span>
                    <span style={{ fontSize: '11px', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                      {count} Cabezas
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{grupo.descripcion}</p>
                </div>
              );
            })}
          </>
        )}

        {vistaActual === 'ANIMALES' && grupoSeleccionado && (
          <>
            <div className="card-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#047857', textTransform: 'uppercase' }}>Grupo Activo</span>
                <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{grupoSeleccionado.nombre}</h3>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  className="no-print"
                  onClick={generarPDF}
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                >
                  📥 Reporte Raza PDF
                </button>
                <button className="btn-primary no-print" style={{ width: 'auto', fontSize: '12px', padding: '8px 12px' }} onClick={abrirModalNuevoAnimal}>
                  + Nuevo
                </button>
              </div>
            </div>

            <div className="card-box no-print">
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>🔍 Buscar por Código:</label>
              <input 
                type="text" 
                placeholder="Escriba el código..." 
                value={busquedaCodigo} 
                onChange={(e) => setBusquedaCodigo(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '12px', outline: 'none' }}
              />
            </div>

            {obtenerAnimalesDelGrupo().length === 0 ? (
              <div className="card-box" style={{ textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                No se encontraron animales con ese código en este grupo. 🌾
              </div>
            ) : (
              obtenerAnimalesDelGrupo().map((animal) => (
                <div 
                  key={animal.id} 
                  className="card-box" 
                  onClick={() => { setAnimalSeleccionadoId(animal.id); setVistaActual('FICHA'); }}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#d1fae5', color: '#065f46', padding: '2px 6px', borderRadius: '6px' }}>
                        #{animal.codigo} 🏷️
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', background: animal.estado === 'Saludable' ? '#d1fae5' : '#fef3c7', color: animal.estado === 'Saludable' ? '#065f46' : '#92400e' }}>
                        {animal.estado} 🩺
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: '6px 0 0 0' }}>
                      Peso: <strong>{animal.pesoActual} kg ⚖️</strong> • {calcularEdad(animal.fechaNacimiento)} 🎂
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#047857' }}>Ver →</span>
                </div>
              ))
            )}

            {mostrarModalNuevo && (
              <div className="no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
                <div style={{ background: 'white', width: '100%', maxWidth: '360px', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>🐂 Registrar Nuevo Animal</h3>
                    <button onClick={() => setMostrarModalNuevo(false)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                  </div>

                  <form onSubmit={manejarAgregarAnimal} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Código Único Visible * 🏷️</label>
                      <input type="text" placeholder="Ej. 105" value={nuevoCodigo} onChange={(e) => setNuevoCodigo(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Peso Inicial (kg) * ⚖️</label>
                      <input type="number" placeholder="Ej. 350" value={nuevoPeso} onChange={(e) => setNuevoPeso(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Fecha de Nacimiento * 📅</label>
                      <input type="date" value={nuevaFechaNac} onChange={(e) => setNuevaFechaNac(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Estado de Salud 🩺</label>
                      <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', boxSizing: 'border-box' }}>
                        <option value="Saludable">Saludable 🟢</option>
                        <option value="En Tratamiento">En Tratamiento 🟡</option>
                        <option value="Gestante">Gestante 🟣</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setMostrarModalNuevo(false)}>Cancelar</button>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar 💾</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {vistaActual === 'FICHA' && animalSeleccionado && (
          <>
            <div className="card-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>📋 Ficha del Animal #{animalSeleccionado.codigo}</h3>
                <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#d1fae5', color: '#065f46', padding: '3px 8px', borderRadius: '6px' }}>
                  {animalSeleccionado.estado} 🩺
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#ecfdf5', padding: '12px', borderRadius: '12px', marginBottom: '12px', fontSize: '12px', border: '1px solid #a7f3d0' }}>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Edad Calculada:</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: '#1e293b' }}>{calcularEdad(animalSeleccionado.fechaNacimiento)} 🎂</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Peso Actual:</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: '#047857', fontSize: '14px' }}>{animalSeleccionado.pesoActual} kg ⚖️</p>
                </div>
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid #a7f3d0', paddingTop: '6px', marginTop: '4px' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Fecha de Nacimiento:</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: '#1e293b' }}>{animalSeleccionado.fechaNacimiento} 📅</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }} className="no-print">
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setPesoNuevoRegistro(animalSeleccionado.pesoActual);
                    setEstadoNuevoRegistro(animalSeleccionado.estado);
                    setMostrarModalActualizar(true);
                  }}
                >
                  Actualizar ⚖️
                </button>
                <button 
                  onClick={generarPDF}
                  style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '10px', fontSize: '12px' }}
                >
                  📥 Ficha PDF
                </button>
                <button 
                  onClick={() => eliminarAnimal(animalSeleccionado.id)}
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '10px' }}
                >
                  Eliminar 🗑️
                </button>
              </div>
            </div>

            {mostrarModalActualizar && (
              <div className="no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
                <div style={{ background: 'white', width: '100%', maxWidth: '360px', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>Actualizar #{animalSeleccionado.codigo} 📋</h3>
                    <button onClick={() => setMostrarModalActualizar(false)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                  </div>

                  <form onSubmit={manejarActualizarAnimal} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Nuevo Peso (kg) ⚖️</label>
                      <input type="number" value={pesoNuevoRegistro} onChange={(e) => setPesoNuevoRegistro(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Estado de Salud 🩺</label>
                      <select value={estadoNuevoRegistro} onChange={(e) => setEstadoNuevoRegistro(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', boxSizing: 'border-box' }}>
                        <option value="Saludable">Saludable 🟢</option>
                        <option value="En Tratamiento">En Tratamiento 🟡</option>
                        <option value="Gestante">Gestante 🟣</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setMostrarModalActualizar(false)}>Cancelar</button>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>Actualizar 💾</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="card-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#047857', margin: 0, fontWeight: 'bold' }}>
                  💉 Historial Sanitario y Alertas
                </h3>
                <button 
                  className="no-print"
                  onClick={() => {
                    setNombreVacuna('');
                    setFechaVacuna('');
                    setDosisVacuna('');
                    setMostrarModalVacuna(true);
                  }}
                  style={{ background: '#059669', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  + Agregar Tratamiento
                </button>
              </div>

              {animalSeleccionado.vacunas.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Sin tratamientos registrados. 🛡️</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {animalSeleccionado.vacunas.map((v) => {
                    const alerta = evaluarAlertaInteligente(v.vacuna, v.fecha);
                    return (
                      <div key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{v.vacuna} 🧪</span>
                          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}>
                            {v.dosis}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                          <span style={{ color: '#64748b' }}>📅 Aplicado: {v.fecha}</span>
                          <span style={{ 
                            background: alerta.colorBg, 
                            color: alerta.colorTxt, 
                            border: `1px solid ${alerta.borde}`, 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontWeight: 'bold',
                            fontSize: '10px'
                          }}>
                            {alerta.texto}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {mostrarModalVacuna && (
              <div className="no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
                <div style={{ background: 'white', width: '100%', maxWidth: '360px', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>💉 Registrar Tratamiento / Vacuna</h3>
                    <button onClick={() => setMostrarModalVacuna(false)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                  </div>

                  <form onSubmit={manejarAgregarVacuna} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Seleccione Producto * 🧪</label>
                      <select
                        value={nombreVacuna}
                        onChange={(e) => setNombreVacuna(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', boxSizing: 'border-box', fontSize: '12px', fontWeight: 'bold', color: '#047857' }}
                      >
                        <option value="">-- Seleccione de la lista --</option>
                        <optgroup label="🛡️ Vacunas Bovinas">
                          {LISTA_VACUNAS_ANUALES.map((vac, i) => (
                            <option key={`v-${i}`} value={vac}>{vac}</option>
                          ))}
                        </optgroup>
                        <optgroup label="🧴 Antiparasitarios y Garrapaticidas">
                          {LISTA_CONTROL_PARASITARIO.map((par, i) => (
                            <option key={`p-${i}`} value={par}>{par}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>O escriba otro tratamiento personalizado:</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Vitamina AD3E..." 
                        value={nombreVacuna} 
                        onChange={(e) => setNombreVacuna(e.target.value)} 
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Fecha de Aplicación * 📅</label>
                      <input type="date" value={fechaVacuna} onChange={(e) => setFechaVacuna(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Dosis * 💉</label>
                      <input type="text" placeholder="Ej. 5 ml" value={dosisVacuna} onChange={(e) => setDosisVacuna(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setMostrarModalVacuna(false)}>Cancelar</button>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar 💾</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="card-box">
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#047857', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                ⚖️ Historial de Pesos
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {animalSeleccionado.historialPesos.map((h, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>📅 {h.fecha}</span>
                    <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                      {h.peso} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </main>

      <footer className="no-print" style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#64748b', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        Ganado Fácil Web • Versión Esmeralda Estructurada 🌾🐂
      </footer>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: #000 !important;
          }
          .app-container {
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .card-box {
            border: 1px solid #cbd5e1 !important;
            break-inside: avoid;
            margin-bottom: 12px !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}