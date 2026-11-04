import React, { useState, useEffect } from 'react';
import { 
  Beef, Activity, Syringe, Scale, Search, 
  Plus, ArrowLeft, Edit, Trash2, Utensils, ChevronRight 
} from 'lucide-react';

const INITIAL_DATA = {
  bloques: [
    { id: 101, nombre: 'Lote El Pastizal', raza: 'Brahman', descripcion: 'Resistentes al clima cálido.', color: '#059669' },
    { id: 102, nombre: 'Lote La Lechera', raza: 'Gyr', descripcion: 'Alta producción lechera.', color: '#0284c7' }
  ],
  animales: [
    {
      id: 'internal-001',
      codigo: '1',
      bloqueId: 101,
      fechaNacimiento: '2022-03-15',
      pesoActual: 450,
      estado: 'Saludable',
      notas: 'Animal de buena genética.',
      historialPesos: [
        { fecha: '2023-01-10', peso: 280 },
        { fecha: '2023-08-20', peso: 370 },
        { fecha: '2024-02-15', peso: 450 }
      ],
      vacunas: [
        { id: 1, vacuna: 'Rabia bovina', fecha: '2025-01-10', dosis: '2 ml' },
        { id: 2, vacuna: 'Ivermectina', fecha: '2025-10-01', dosis: '10 ml' }
      ],
      alimentacion: [
        { id: 1, tipo: 'Pasto Brachiaria', cantidad: '15 kg', fecha: '2024-03-01' }
      ]
    }
  ]
};

const RAZAS_DISPONIBLES = ['Brahman', 'Nelore', 'Gyr', 'Brangus', 'Angus', 'Limousin', 'Senepol'];

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
  if(!fechaNac) return "No registrada";
  const nac = new Date(fechaNac);
  const hoy = new Date();
  let meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth());
  if (hoy.getDate() < nac.getDate()) meses--;
  const años = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;
  return `${años > 0 ? `${años} año(s) ` : ''}${mesesRestantes} mes(es)`;
};

// Función de Alerta Inteligente (Recuperada de tu código original)
const evaluarAlertaInteligente = (nombreProducto, fechaAplicacion) => {
  const hoy = new Date();
  const fechaApp = new Date(fechaAplicacion);
  const diferenciaDias = Math.floor((hoy - fechaApp) / (1000 * 60 * 60 * 24));

  const esAnual = LISTA_VACUNAS_ANUALES.some(v => v.toLowerCase() === nombreProducto.toLowerCase());
  const esParasito = LISTA_CONTROL_PARASITARIO.some(p => p.toLowerCase() === nombreProducto.toLowerCase());

  if (esAnual) {
    if (diferenciaDias > 330) {
      return { texto: `⚠️ Refuerzo Vencido (${diferenciaDias} d)`, colorBg: '#fef2f2', colorTxt: '#dc2626' };
    } else if (diferenciaDias > 270) {
      return { texto: `⚡ Próximo a vencer (${diferenciaDias} d)`, colorBg: '#fef3c7', colorTxt: '#d97706' };
    } else {
      return { texto: `✅ Al día (${diferenciaDias} d)`, colorBg: '#ecfdf5', colorTxt: '#059669' };
    }
  } else if (esParasito) {
    if (diferenciaDias > 120) {
      return { texto: `⚠️ Baño/Dosis Necesaria (${diferenciaDias} d)`, colorBg: '#fef2f2', colorTxt: '#dc2626' };
    } else if (diferenciaDias > 90) {
      return { texto: `⚡ Control próximo (${diferenciaDias} d)`, colorBg: '#fef3c7', colorTxt: '#d97706' };
    } else {
      return { texto: `✅ Protección activa (${diferenciaDias} d)`, colorBg: '#ecfdf5', colorTxt: '#059669' };
    }
  } else {
    return { texto: `🛡️ Tratamiento único (${diferenciaDias} d)`, colorBg: '#eff6ff', colorTxt: '#1d4ed8' };
  }
};

export default function App() {
  const [datos, setDatos] = useState(() => {
    const guardados = localStorage.getItem('ganado_facil_v2');
    return guardados ? JSON.parse(guardados) : INITIAL_DATA;
  });

  const [vista, setVista] = useState('INICIO');
  const [bloqueSel, setBloqueSel] = useState(null);
  const [animalSelId, setAnimalSelId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Modales
  const [modalNuevoBloque, setModalNuevoBloque] = useState(false);
  const [modalNuevoAnimal, setModalNuevoAnimal] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [modalVacuna, setModalVacuna] = useState(false);
  const [modalAlimento, setModalAlimento] = useState(false);

  // Formularios
  const [formBloque, setFormBloque] = useState({ nombre: '', raza: 'Brahman', descripcion: '' });
  const [formAnimal, setFormAnimal] = useState({ codigo: '', peso: '', fechaNac: '', notas: '', estado: 'Saludable' });
  const [formPeso, setFormPeso] = useState({ peso: '', estado: '' });
  const [formVacuna, setFormVacuna] = useState({ nombre: '', fecha: '', dosis: '' });
  const [formAlimento, setFormAlimento] = useState({ tipo: '', cantidad: '', fecha: '' });

  useEffect(() => {
    localStorage.setItem('ganado_facil_v2', JSON.stringify(datos));
  }, [datos]);

  const animalSel = datos.animales.find(a => a.id === animalSelId);

  // --- ACCIONES ---
  const crearBloque = (e) => {
    e.preventDefault();
    const nuevo = { id: Date.now(), ...formBloque };
    setDatos(prev => ({ ...prev, bloques: [...prev.bloques, nuevo] }));
    setModalNuevoBloque(false);
  };

  const crearAnimal = (e) => {
    e.preventDefault();
    if(datos.animales.some(a => a.bloqueId === bloqueSel.id && a.codigo === formAnimal.codigo)) {
      return alert("El código ya existe en este bloque.");
    }
    const nuevo = {
      id: 'int-' + Date.now(),
      codigo: formAnimal.codigo,
      bloqueId: bloqueSel.id,
      fechaNacimiento: formAnimal.fechaNac,
      pesoActual: Number(formAnimal.peso),
      estado: formAnimal.estado,
      notas: formAnimal.notas,
      historialPesos: [{ fecha: new Date().toISOString().split('T')[0], peso: Number(formAnimal.peso) }],
      vacunas: [],
      alimentacion: []
    };
    setDatos(prev => ({ ...prev, animales: [nuevo, ...prev.animales] }));
    setModalNuevoAnimal(false);
  };

  const actualizarAnimal = (e) => {
    e.preventDefault();
    const fechaHoy = new Date().toISOString().split('T')[0];
    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => {
        if (a.id === animalSelId) {
          const nuevoHistorial = formPeso.peso ? [...a.historialPesos, { fecha: fechaHoy, peso: Number(formPeso.peso) }] : a.historialPesos;
          return {
            ...a,
            pesoActual: formPeso.peso ? Number(formPeso.peso) : a.pesoActual,
            estado: formPeso.estado || a.estado,
            historialPesos: nuevoHistorial
          };
        }
        return a;
      })
    }));
    setModalActualizar(false);
  };

  const agregarVacuna = (e) => {
    e.preventDefault();
    const nueva = { id: Date.now(), ...formVacuna };
    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => a.id === animalSelId ? { ...a, vacunas: [...a.vacunas, nueva] } : a)
    }));
    setModalVacuna(false);
  };

  const agregarAlimento = (e) => {
    e.preventDefault();
    const nuevo = { id: Date.now(), ...formAlimento };
    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => a.id === animalSelId ? { ...a, alimentacion: [...(a.alimentacion || []), nuevo] } : a)
    }));
    setModalAlimento(false);
  };

  const eliminarAnimal = (id) => {
    if (window.confirm('¿Eliminar este animal?')) {
      setDatos(prev => ({ ...prev, animales: prev.animales.filter(a => a.id !== id) }));
      setVista('ANIMALES');
    }
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Beef size={28} />
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Ganado Fácil</h1>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>Control Pecuario</p>
          </div>
        </div>
        {vista !== 'INICIO' && (
          <button className="btn-secondary" style={{ width: 'auto', padding: '6px 12px', background: 'rgba(255,255,255,0.2)', color: 'white' }} onClick={() => {
            if (vista === 'FICHA') setVista('ANIMALES');
            else setVista('INICIO');
          }}>
            <ArrowLeft size={16} />
          </button>
        )}
      </header>

      <main style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* VISTA INICIO */}
        {vista === 'INICIO' && (
          <>
            <div className="card-box" style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white' }}>
              <h2 style={{ fontSize: '18px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity /> Mis Bloques
              </h2>
              <p style={{ fontSize: '12px', marginBottom: '16px', opacity: 0.9 }}>Gestione sus lotes de ganado</p>
              <button className="btn-primary" style={{ background: 'white', color: '#047857' }} onClick={() => setModalNuevoBloque(true)}>
                <Plus size={16} /> Crear Nuevo Bloque
              </button>
            </div>

            {datos.bloques.map(b => {
              const count = datos.animales.filter(a => a.bloqueId === b.id).length;
              return (
                <div key={b.id} className="card-box" style={{ cursor: 'pointer', borderLeft: `4px solid ${b.color || '#059669'}` }} onClick={() => { setBloqueSel(b); setVista('ANIMALES'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>{b.nombre}</h3>
                    <span style={{ fontSize: '11px', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                      {count} Animales
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Raza: {b.raza} • {b.descripcion}</p>
                </div>
              );
            })}
          </>
        )}

        {/* VISTA LISTA DE ANIMALES */}
        {vista === 'ANIMALES' && bloqueSel && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{bloqueSel.nombre}</h2>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Raza: {bloqueSel.raza}</p>
              </div>
              <button className="btn-primary" style={{ width: 'auto', padding: '6px 12px' }} onClick={() => { setFormAnimal({ codigo: '', peso: '', fechaNac: '', notas: '', estado: 'Saludable' }); setModalNuevoAnimal(true); }}>
                <Plus size={16} /> Nuevo
              </button>
            </div>

            <div className="card-box" style={{ padding: '8px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px' }}>
                <Search size={16} color="#64748b" />
                <input type="text" placeholder="Buscar por código..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }} />
              </div>
            </div>

            {datos.animales.filter(a => a.bloqueId === bloqueSel.id && a.codigo.includes(busqueda)).map(a => (
              <div key={a.id} className="card-box" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => { setAnimalSelId(a.id); setVista('FICHA'); }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px' }}>#{a.codigo}</span>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', background: a.estado === 'Saludable' ? '#d1fae5' : '#fef3c7', color: a.estado === 'Saludable' ? '#065f46' : '#92400e', padding: '2px 8px', borderRadius: '6px' }}>{a.estado}</span>
                  </div>
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Scale size={14} /> {a.pesoActual} kg • {calcularEdad(a.fechaNacimiento)}
                  </p>
                </div>
                <ChevronRight size={18} color="#94a3b8" />
              </div>
            ))}
          </>
        )}

        {/* VISTA FICHA DEL ANIMAL */}
        {vista === 'FICHA' && animalSel && (
          <>
            <div className="card-box" style={{ borderTop: '4px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Ficha #{animalSel.codigo}</h2>
                <span style={{ fontSize: '12px', fontWeight: 'bold', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '6px' }}>{animalSel.estado}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '16px' }}>
                <div><span style={{ color: '#64748b' }}>Peso Actual:</span><br/><strong style={{ fontSize: '16px', color: '#047857' }}>{animalSel.pesoActual} kg</strong></div>
                <div><span style={{ color: '#64748b' }}>Edad:</span><br/><strong>{calcularEdad(animalSel.fechaNacimiento)}</strong></div>
                <div><span style={{ color: '#64748b' }}>Nacimiento:</span><br/><strong>{animalSel.fechaNacimiento || 'No reg.'}</strong></div>
                <div><span style={{ color: '#64748b' }}>Notas:</span><br/><span style={{ fontStyle: 'italic' }}>{animalSel.notas || 'Sin notas'}</span></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button className="btn-primary" onClick={() => { setFormPeso({ peso: animalSel.pesoActual, estado: animalSel.estado }); setModalActualizar(true); }}>
                  <Edit size={14} /> Peso / Estado
                </button>
                <button className="btn-secondary" style={{ background: '#fee2e2', color: '#dc2626', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }} onClick={() => eliminarAnimal(animalSel.id)}>
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>

            {/* SECCIÓN VACUNAS CON ALERTA INTELIGENTE */}
            <div className="card-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}><Syringe size={16} color="#0284c7" /> Sanidad</h3>
                <button style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setFormVacuna({ nombre: '', fecha: '', dosis: '' }); setModalVacuna(true); }}>
                  + Registrar
                </button>
              </div>
              {animalSel.vacunas.length === 0 ? <p style={{ fontSize: '12px', color: '#64748b' }}>No hay vacunas.</p> : animalSel.vacunas.map(v => {
                const alerta = evaluarAlertaInteligente(v.vacuna, v.fecha);
                return (
                  <div key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>{v.vacuna}</strong> ({v.dosis})</span>
                      <span style={{ color: '#64748b' }}>{v.fecha}</span>
                    </div>
                    <div>
                      <span style={{ background: alerta.colorBg, color: alerta.colorTxt, padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                        {alerta.texto}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SECCIÓN ALIMENTACIÓN */}
            <div className="card-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}><Utensils size={16} color="#d97706" /> Alimentación</h3>
                <button style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setFormAlimento({ tipo: '', cantidad: '', fecha: new Date().toISOString().split('T')[0] }); setModalAlimento(true); }}>
                  + Registrar
                </button>
              </div>
              {(!animalSel.alimentacion || animalSel.alimentacion.length === 0) ? <p style={{ fontSize: '12px', color: '#64748b' }}>No hay registros.</p> : animalSel.alimentacion.map(al => (
                <div key={al.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span><strong>{al.tipo}</strong> - {al.cantidad}</span>
                  <span style={{ color: '#64748b' }}>{al.fecha}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MODALES */}
        {modalNuevoBloque && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '360px', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Crear Bloque</h3>
              <form onSubmit={crearBloque} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Nombre del bloque" required value={formBloque.nombre} onChange={e => setFormBloque({...formBloque, nombre: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <select value={formBloque.raza} onChange={e => setFormBloque({...formBloque, raza: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  {RAZAS_DISPONIBLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input type="text" placeholder="Descripción breve" value={formBloque.descripcion} onChange={e => setFormBloque({...formBloque, descripcion: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setModalNuevoBloque(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalNuevoAnimal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '360px', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Nuevo Animal</h3>
              <form onSubmit={crearAnimal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Código (Ej. 105)" required value={formAnimal.codigo} onChange={e => setFormAnimal({...formAnimal, codigo: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="number" placeholder="Peso inicial (kg)" required value={formAnimal.peso} onChange={e => setFormAnimal({...formAnimal, peso: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="date" required value={formAnimal.fechaNac} onChange={e => setFormAnimal({...formAnimal, fechaNac: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="Notas (opcional)" value={formAnimal.notas} onChange={e => setFormAnimal({...formAnimal, notas: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setModalNuevoAnimal(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalActualizar && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '360px', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Actualizar Ficha</h3>
              <form onSubmit={actualizarAnimal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Nuevo Peso (kg)</label>
                <input type="number" required value={formPeso.peso} onChange={e => setFormPeso({...formPeso, peso: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Estado</label>
                <select value={formPeso.estado} onChange={e => setFormPeso({...formPeso, estado: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="Saludable">Saludable</option>
                  <option value="En Tratamiento">En Tratamiento</option>
                  <option value="Gestante">Gestante</option>
                </select>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setModalActualizar(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalVacuna && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '360px', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Registrar Vacuna</h3>
              <form onSubmit={agregarVacuna} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select required value={formVacuna.nombre} onChange={e => setFormVacuna({...formVacuna, nombre: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="">Seleccione vacuna...</option>
                  {LISTA_VACUNAS_ANUALES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <input type="date" required value={formVacuna.fecha} onChange={e => setFormVacuna({...formVacuna, fecha: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="Dosis (Ej. 2ml)" required value={formVacuna.dosis} onChange={e => setFormVacuna({...formVacuna, dosis: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setModalVacuna(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalAlimento && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '360px', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Registrar Alimentación</h3>
              <form onSubmit={agregarAlimento} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Tipo (Ej. Pasto, Concentrado)" required value={formAlimento.tipo} onChange={e => setFormAlimento({...formAlimento, tipo: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="Cantidad (Ej. 15 kg)" required value={formAlimento.cantidad} onChange={e => setFormAlimento({...formAlimento, cantidad: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="date" required value={formAlimento.fecha} onChange={e => setFormAlimento({...formAlimento, fecha: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setModalAlimento(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
      
      <footer style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
        Ganado Fácil v2.0 • Sistema de Gestión
      </footer>
    </div>
  );
}