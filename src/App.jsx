import React, { useState, useEffect } from 'react';
import { 
  Beef, Activity, Syringe, Scale, Search, 
  Plus, ArrowLeft, Edit, Trash2, Utensils, ChevronRight, BookOpen
} from 'lucide-react';

// Nueva estructura de datos usando edadEstimada
const INITIAL_DATA = {
  bloques: [
    { id: 101, nombre: 'Lote El Pastizal', raza: 'Brahman', descripcion: 'Resistentes al clima cálido.' },
    { id: 102, nombre: 'Lote La Lechera', raza: 'Gyr', descripcion: 'Alta producción lechera.' }
  ],
  animales: [
    {
      id: 'internal-001',
      codigo: '1',
      bloqueId: 101,
      edadEstimada: '2-3 años', // <-- Nuevo campo
      pesoActual: 450,
      estado: 'Saludable',
      notas: 'Animal de buena genética.',
      historialPesos: [{ fecha: '2024-02-15', peso: 450 }],
      vacunas: [{ id: 1, vacuna: 'Rabia bovina', fecha: '2025-01-10', dosis: '2 ml' }],
      alimentacion: [{ id: 1, tipo: 'Pasto Brachiaria', cantidad: '15 kg', fecha: '2024-03-01' }]
    }
  ]
};

const RAZAS_DISPONIBLES = ['Brahman', 'Nelore', 'Gyr', 'Brangus', 'Angus', 'Limousin', 'Senepol'];

// Opciones de edad estimada (Meses y Años)
const OPCIONES_EDAD = [
  '1-3 meses',
  '4-6 meses',
  '7-9 meses',
  '10-12 meses',
  '1-2 años',
  '2-3 años',
  '3-4 años',
  '4-5 años',
  'Más de 5 años'
];

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

const evaluarAlertaInteligente = (nombreProducto, fechaAplicacion) => {
  const hoy = new Date();
  const fechaApp = new Date(fechaAplicacion);
  const diferenciaDias = Math.floor((hoy - fechaApp) / (1000 * 60 * 60 * 24));

  const esAnual = LISTA_VACUNAS_ANUALES.some(v => v.toLowerCase() === nombreProducto.toLowerCase());
  const esParasito = LISTA_CONTROL_PARASITARIO.some(p => p.toLowerCase() === nombreProducto.toLowerCase());

  if (esAnual) {
    if (diferenciaDias > 330) return { texto: `⚠️ Vencido (${diferenciaDias} d)`, colorBg: '#fef2f2', colorTxt: '#dc2626' };
    if (diferenciaDias > 270) return { texto: `⚡ Próximo (${diferenciaDias} d)`, colorBg: '#fef3c7', colorTxt: '#d97706' };
    return { texto: `✅ Al día (${diferenciaDias} d)`, colorBg: '#ecfdf5', colorTxt: '#059669' };
  } else if (esParasito) {
    if (diferenciaDias > 120) return { texto: `⚠️ Baño requerido (${diferenciaDias} d)`, colorBg: '#fef2f2', colorTxt: '#dc2626' };
    if (diferenciaDias > 90) return { texto: `⚡ Próximo (${diferenciaDias} d)`, colorBg: '#fef3c7', colorTxt: '#d97706' };
    return { texto: `✅ Protegido (${diferenciaDias} d)`, colorBg: '#ecfdf5', colorTxt: '#059669' };
  }
  return { texto: `🛡️ Único (${diferenciaDias} d)`, colorBg: '#eff6ff', colorTxt: '#1d4ed8' };
};

export default function App() {
  // Cambiamos a v3 para limpiar la fecha vieja en el localStorage
  const [datos, setDatos] = useState(() => {
    const guardados = localStorage.getItem('ganado_facil_v3');
    return guardados ? JSON.parse(guardados) : INITIAL_DATA;
  });

  const [vista, setVista] = useState('INICIO');
  const [bloqueSel, setBloqueSel] = useState(null);
  const [animalSelId, setAnimalSelId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [modalNuevoBloque, setModalNuevoBloque] = useState(false);
  const [modalEditarBloque, setModalEditarBloque] = useState(false);
  const [modalNuevoAnimal, setModalNuevoAnimal] = useState(false);
  const [modalEditarAnimal, setModalEditarAnimal] = useState(false);
  const [modalActualizarPeso, setModalActualizarPeso] = useState(false);
  const [modalVacuna, setModalVacuna] = useState(false);
  const [modalAlimento, setModalAlimento] = useState(false);

  const [formBloque, setFormBloque] = useState({ nombre: '', raza: 'Brahman', descripcion: '' });
  // Cambiamos fechaNac por edadEstimada
  const [formAnimal, setFormAnimal] = useState({ codigo: '', peso: '', edadEstimada: '1-2 años', notas: '', estado: 'Saludable' });
  const [formEditarAnimal, setFormEditarAnimal] = useState({ codigo: '', edadEstimada: '', notas: '', estado: 'Saludable' });
  const [formPeso, setFormPeso] = useState({ peso: '', estado: '' });
  const [formVacuna, setFormVacuna] = useState({ nombre: '', fecha: '', dosis: '' });
  const [formAlimento, setFormAlimento] = useState({ tipo: '', cantidad: '', fecha: '' });

  useEffect(() => {
    localStorage.setItem('ganado_facil_v3', JSON.stringify(datos));
  }, [datos]);

  const animalSel = datos.animales.find(a => a.id === animalSelId);

  const crearBloque = (e) => {
    e.preventDefault();
    setDatos(prev => ({ ...prev, bloques: [...prev.bloques, { id: Date.now(), ...formBloque }] }));
    setModalNuevoBloque(false);
  };

  const guardarEdicionBloque = (e) => {
    e.preventDefault();
    setDatos(prev => ({
      ...prev,
      bloques: prev.bloques.map(b => b.id === bloqueSel.id ? { ...b, ...formBloque } : b)
    }));
    setBloqueSel({ ...bloqueSel, ...formBloque });
    setModalEditarBloque(false);
  };

  const crearAnimal = (e) => {
    e.preventDefault();
    if(datos.animales.some(a => a.bloqueId === bloqueSel.id && a.codigo === formAnimal.codigo)) {
      return alert("El código ya existe.");
    }
    const nuevo = {
      id: 'int-' + Date.now(),
      codigo: formAnimal.codigo,
      bloqueId: bloqueSel.id,
      edadEstimada: formAnimal.edadEstimada,
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

  const guardarEdicionAnimal = (e) => {
    e.preventDefault();
    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => a.id === animalSelId ? { 
        ...a, 
        codigo: formEditarAnimal.codigo,
        edadEstimada: formEditarAnimal.edadEstimada,
        notas: formEditarAnimal.notas,
        estado: formEditarAnimal.estado
      } : a)
    }));
    setModalEditarAnimal(false);
  };

  const actualizarPeso = (e) => {
    e.preventDefault();
    const fechaHoy = new Date().toISOString().split('T')[0];
    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => {
        if (a.id === animalSelId) {
          const nuevoHistorial = formPeso.peso ? [...a.historialPesos, { fecha: fechaHoy, peso: Number(formPeso.peso) }] : a.historialPesos;
          return { ...a, pesoActual: formPeso.peso ? Number(formPeso.peso) : a.pesoActual, estado: formPeso.estado || a.estado, historialPesos: nuevoHistorial };
        }
        return a;
      })
    }));
    setModalActualizarPeso(false);
  };

  const agregarVacuna = (e) => {
    e.preventDefault();
    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => a.id === animalSelId ? { ...a, vacunas: [...a.vacunas, { id: Date.now(), ...formVacuna }] } : a)
    }));
    setModalVacuna(false);
  };

  const agregarAlimento = (e) => {
    e.preventDefault();
    setDatos(prev => ({
      ...prev,
      animales: prev.animales.map(a => a.id === animalSelId ? { ...a, alimentacion: [...(a.alimentacion || []), { id: Date.now(), ...formAlimento }] } : a)
    }));
    setModalAlimento(false);
  };

  const eliminarAnimal = (id) => {
    if (window.confirm('¿Eliminar este animal?')) {
      setDatos(prev => ({ ...prev, animales: prev.animales.filter(a => a.id !== id) }));
      setVista('ANIMALES');
    }
  };

  const inputClass = "w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm";
  const modalClass = "fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm";
  const modalBoxClass = "bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl";
  const btnPrimary = "bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors w-full text-sm";
  const btnSecondary = "bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors w-full text-sm";

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f0fdf4] flex flex-col font-sans shadow-2xl">
      
      <header className="bg-emerald-700 text-white p-4 flex justify-between items-center border-b-2 border-emerald-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Beef size={28} />
          <div>
            <h1 className="m-0 text-lg font-bold leading-tight">Ganado Fácil</h1>
            <p className="m-0 text-[11px] opacity-80">Control Pecuario</p>
          </div>
        </div>
        {vista !== 'INICIO' && (
          <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors" onClick={() => {
            if (vista === 'FICHA') setVista('ANIMALES');
            else setVista('INICIO');
          }}>
            <ArrowLeft size={18} />
          </button>
        )}
      </header>

      <main className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto">
        
        {vista === 'INICIO' && (
          <>
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 text-white shadow-md">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-1"><Activity /> Mis Bloques</h2>
              <p className="text-xs opacity-90 mb-4">Gestione sus lotes de ganado</p>
              <div className="flex gap-2">
                <button className="bg-white text-emerald-800 hover:bg-emerald-50 flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors" onClick={() => setModalNuevoBloque(true)}>
                  <Plus size={18} /> Nuevo Bloque
                </button>
                <button className="bg-emerald-700 border border-emerald-500 hover:bg-emerald-600 text-white flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors" onClick={() => setVista('GUIA')}>
                  <BookOpen size={18} /> Guía
                </button>
              </div>
            </div>

            {datos.bloques.map(b => {
              const count = datos.animales.filter(a => a.bloqueId === b.id).length;
              return (
                <div key={b.id} className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex justify-between items-center mb-1 cursor-pointer" onClick={() => { setBloqueSel(b); setVista('ANIMALES'); }}>
                    <h3 className="m-0 text-sm font-bold text-slate-800">{b.nombre}</h3>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {count} Animales
                    </span>
                  </div>
                  <p className="m-0 text-xs text-slate-500 cursor-pointer" onClick={() => { setBloqueSel(b); setVista('ANIMALES'); }}>Raza: {b.raza} • {b.descripcion}</p>
                  
                  <button 
                    className="absolute top-4 right-12 text-slate-400 hover:text-emerald-600 transition-colors"
                    onClick={() => { setBloqueSel(b); setFormBloque({ nombre: b.nombre, raza: b.raza, descripcion: b.descripcion }); setModalEditarBloque(true); }}
                    title="Editar Bloque"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              );
            })}
          </>
        )}

        {vista === 'GUIA' && (
          <>
            <div className="bg-emerald-100 border border-emerald-300 rounded-2xl p-4 text-center shadow-sm mb-2">
              <h2 className="text-sm font-bold text-emerald-800 m-0 flex items-center justify-center gap-2"><BookOpen size={18}/> Guía Sanitaria</h2>
              <p className="text-xs text-emerald-700 m-0 mt-1">Manual de consulta de vacunas y tratamientos.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-blue-800 border-b-2 border-blue-200 pb-2 mb-3 flex items-center gap-2"><Syringe size={14}/> Vacunas Bovinas</h3>
              <div className="flex flex-col gap-3">
                {VADEMECUM_MEDICAMENTOS.filter(m => m.tipo === 'Vacuna Anual').map((med, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-slate-800">{med.nombre}</span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md whitespace-nowrap ml-2">Anual</span>
                    </div>
                    <p className="text-xs text-slate-500 m-0 leading-relaxed">{med.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-amber-800 border-b-2 border-amber-200 pb-2 mb-3 flex items-center gap-2"><Activity size={14}/> Antiparasitarios y Baños</h3>
              <div className="flex flex-col gap-3">
                {VADEMECUM_MEDICAMENTOS.filter(m => m.tipo.includes('Antiparasitario')).map((med, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-slate-800">{med.nombre}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md whitespace-nowrap ml-2">Control</span>
                    </div>
                    <p className="text-xs text-slate-500 m-0 leading-relaxed">{med.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {vista === 'ANIMALES' && bloqueSel && (
          <>
            <div className="flex justify-between items-center mb-1">
              <div>
                <h2 className="m-0 text-base font-bold text-slate-800">{bloqueSel.nombre}</h2>
                <p className="m-0 text-xs text-slate-500">Raza: {bloqueSel.raza}</p>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors" onClick={() => { setFormAnimal({ codigo: '', peso: '', edadEstimada: '1-2 años', notas: '', estado: 'Saludable' }); setModalNuevoAnimal(true); }}>
                <Plus size={14} /> Nuevo
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center gap-2 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Buscar por código..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="border-none bg-transparent outline-none w-full text-sm text-slate-700" />
            </div>

            {datos.animales.filter(a => a.bloqueId === bloqueSel.id && a.codigo.includes(busqueda)).map(a => (
              <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm cursor-pointer flex justify-between items-center hover:border-emerald-300 transition-colors" onClick={() => { setAnimalSelId(a.id); setVista('FICHA'); }}>
                <div>
                  <div className="flex gap-2 items-center mb-1.5">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">#{a.codigo}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${a.estado === 'Saludable' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{a.estado}</span>
                  </div>
                  <p className="m-0 text-xs text-slate-600 flex items-center gap-1">
                    <Scale size={14} /> {a.pesoActual} kg • {a.edadEstimada}
                  </p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            ))}
          </>
        )}

        {vista === 'FICHA' && animalSel && (
          <>
            <div className="bg-white border-t-4 border-emerald-600 border-x border-b border-slate-200 rounded-2xl p-4 shadow-sm relative">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                <h2 className="m-0 text-base font-bold text-slate-800">Ficha #{animalSel.codigo}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">{animalSel.estado}</span>
                  <button className="text-slate-400 hover:text-blue-600 transition-colors" onClick={() => { setFormEditarAnimal({ codigo: animalSel.codigo, edadEstimada: animalSel.edadEstimada, notas: animalSel.notas, estado: animalSel.estado }); setModalEditarAnimal(true); }} title="Editar Datos Generales">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div><span className="text-slate-500 block mb-0.5">Peso Actual:</span><strong className="text-base text-emerald-700">{animalSel.pesoActual} kg</strong></div>
                <div><span className="text-slate-500 block mb-0.5">Edad Estimada:</span><strong className="text-slate-800">{animalSel.edadEstimada}</strong></div>
                <div className="col-span-2"><span className="text-slate-500 block mb-0.5">Notas:</span><span className="italic text-slate-600">{animalSel.notas || 'Sin notas'}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className={btnPrimary} onClick={() => { setFormPeso({ peso: animalSel.pesoActual, estado: animalSel.estado }); setModalActualizarPeso(true); }}>
                  <Scale size={14} /> Peso / Estado
                </button>
                <button className={`${btnSecondary} !bg-red-50 !text-red-600 hover:!bg-red-100`} onClick={() => eliminarAnimal(animalSel.id)}>
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold m-0 flex items-center gap-1.5 text-slate-800"><Syringe size={16} className="text-blue-600" /> Sanidad</h3>
                <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded-md text-xs font-bold transition-colors" onClick={() => { setFormVacuna({ nombre: '', fecha: '', dosis: '' }); setModalVacuna(true); }}>
                  + Registrar
                </button>
              </div>
              {animalSel.vacunas.length === 0 ? <p className="text-xs text-slate-500 m-0">No hay registros.</p> : animalSel.vacunas.map(v => {
                const alerta = evaluarAlertaInteligente(v.vacuna, v.fecha);
                return (
                  <div key={v.id} className="flex flex-col gap-1 text-xs py-2 border-b border-slate-100 last:border-0">
                    <div className="flex justify-between items-center">
                      <span><strong>{v.vacuna}</strong> ({v.dosis})</span>
                      <span className="text-slate-500">{v.fecha}</span>
                    </div>
                    <div>
                      <span style={{ backgroundColor: alerta.colorBg, color: alerta.colorTxt }} className="px-2 py-0.5 rounded text-[10px] font-bold">
                        {alerta.texto}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold m-0 flex items-center gap-1.5 text-slate-800"><Utensils size={16} className="text-amber-600" /> Alimentación</h3>
                <button className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 rounded-md text-xs font-bold transition-colors" onClick={() => { setFormAlimento({ tipo: '', cantidad: '', fecha: new Date().toISOString().split('T')[0] }); setModalAlimento(true); }}>
                  + Registrar
                </button>
              </div>
              {(!animalSel.alimentacion || animalSel.alimentacion.length === 0) ? <p className="text-xs text-slate-500 m-0">No hay registros.</p> : animalSel.alimentacion.map(al => (
                <div key={al.id} className="flex justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                  <span><strong>{al.tipo}</strong> - {al.cantidad}</span>
                  <span className="text-slate-500">{al.fecha}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MODALES */}
        {modalNuevoBloque && (
          <div className={modalClass}>
            <div className={modalBoxClass}>
              <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Crear Bloque</h3>
              <form onSubmit={crearBloque} className="flex flex-col gap-3">
                <input type="text" placeholder="Nombre del bloque" required value={formBloque.nombre} onChange={e => setFormBloque({...formBloque, nombre: e.target.value})} className={inputClass} />
                <select value={formBloque.raza} onChange={e => setFormBloque({...formBloque, raza: e.target.value})} className={inputClass}>
                  {RAZAS_DISPONIBLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input type="text" placeholder="Descripción breve" value={formBloque.descripcion} onChange={e => setFormBloque({...formBloque, descripcion: e.target.value})} className={inputClass} />
                <div className="flex gap-2 mt-2">
                  <button type="button" className={btnSecondary} onClick={() => setModalNuevoBloque(false)}>Cancelar</button>
                  <button type="submit" className={btnPrimary}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalEditarBloque && (
          <div className={modalClass}>
            <div className={modalBoxClass}>
              <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Editar Bloque</h3>
              <form onSubmit={guardarEdicionBloque} className="flex flex-col gap-3">
                <input type="text" placeholder="Nombre del bloque" required value={formBloque.nombre} onChange={e => setFormBloque({...formBloque, nombre: e.target.value})} className={inputClass} />
                <select value={formBloque.raza} onChange={e => setFormBloque({...formBloque, raza: e.target.value})} className={inputClass}>
                  {RAZAS_DISPONIBLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input type="text" placeholder="Descripción breve" value={formBloque.descripcion} onChange={e => setFormBloque({...formBloque, descripcion: e.target.value})} className={inputClass} />
                <div className="flex gap-2 mt-2">
                  <button type="button" className={btnSecondary} onClick={() => setModalEditarBloque(false)}>Cancelar</button>
                  <button type="submit" className={btnPrimary}>Actualizar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalNuevoAnimal && (
          <div className={modalClass}>
            <div className={modalBoxClass}>
              <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Nuevo Animal</h3>
              <form onSubmit={crearAnimal} className="flex flex-col gap-3">
                <input type="text" placeholder="Código (Ej. 105)" required value={formAnimal.codigo} onChange={e => setFormAnimal({...formAnimal, codigo: e.target.value})} className={inputClass} />
                <input type="number" placeholder="Peso inicial (kg)" required value={formAnimal.peso} onChange={e => setFormAnimal({...formAnimal, peso: e.target.value})} className={inputClass} />
                
                <label className="text-xs font-bold text-slate-700">Edad Estimada</label>
                <select value={formAnimal.edadEstimada} onChange={e => setFormAnimal({...formAnimal, edadEstimada: e.target.value})} className={inputClass}>
                  {OPCIONES_EDAD.map(opcion => <option key={opcion} value={opcion}>{opcion}</option>)}
                </select>

                <input type="text" placeholder="Notas (opcional)" value={formAnimal.notas} onChange={e => setFormAnimal({...formAnimal, notas: e.target.value})} className={inputClass} />
                <div className="flex gap-2 mt-2">
                  <button type="button" className={btnSecondary} onClick={() => setModalNuevoAnimal(false)}>Cancelar</button>
                  <button type="submit" className={btnPrimary}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalEditarAnimal && (
          <div className={modalClass}>
            <div className={modalBoxClass}>
              <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Editar Datos Generales</h3>
              <form onSubmit={guardarEdicionAnimal} className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-700">Código</label>
                <input type="text" required value={formEditarAnimal.codigo} onChange={e => setFormEditarAnimal({...formEditarAnimal, codigo: e.target.value})} className={inputClass} />
                
                <label className="text-xs font-bold text-slate-700">Edad Estimada</label>
                <select value={formEditarAnimal.edadEstimada} onChange={e => setFormEditarAnimal({...formEditarAnimal, edadEstimada: e.target.value})} className={inputClass}>
                  {OPCIONES_EDAD.map(opcion => <option key={opcion} value={opcion}>{opcion}</option>)}
                </select>

                <label className="text-xs font-bold text-slate-700">Notas</label>
                <input type="text" value={formEditarAnimal.notas} onChange={e => setFormEditarAnimal({...formEditarAnimal, notas: e.target.value})} className={inputClass} />
                <label className="text-xs font-bold text-slate-700">Estado</label>
                <select value={formEditarAnimal.estado} onChange={e => setFormEditarAnimal({...formEditarAnimal, estado: e.target.value})} className={inputClass}>
                  <option value="Saludable">Saludable</option>
                  <option value="En Tratamiento">En Tratamiento</option>
                  <option value="Gestante">Gestante</option>
                </select>
                <div className="flex gap-2 mt-2">
                  <button type="button" className={btnSecondary} onClick={() => setModalEditarAnimal(false)}>Cancelar</button>
                  <button type="submit" className={btnPrimary}>Actualizar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalActualizarPeso && (
          <div className={modalClass}>
            <div className={modalBoxClass}>
              <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Actualizar Peso / Estado</h3>
              <form onSubmit={actualizarPeso} className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-700">Nuevo Peso (kg)</label>
                <input type="number" required value={formPeso.peso} onChange={e => setFormPeso({...formPeso, peso: e.target.value})} className={inputClass} />
                <label className="text-xs font-bold text-slate-700">Estado</label>
                <select value={formPeso.estado} onChange={e => setFormPeso({...formPeso, estado: e.target.value})} className={inputClass}>
                  <option value="Saludable">Saludable</option>
                  <option value="En Tratamiento">En Tratamiento</option>
                  <option value="Gestante">Gestante</option>
                </select>
                <div className="flex gap-2 mt-2">
                  <button type="button" className={btnSecondary} onClick={() => setModalActualizarPeso(false)}>Cancelar</button>
                  <button type="submit" className={btnPrimary}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalVacuna && (
          <div className={modalClass}>
            <div className={modalBoxClass}>
              <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Registrar Sanidad</h3>
              <form onSubmit={agregarVacuna} className="flex flex-col gap-3">
                <select required value={formVacuna.nombre} onChange={e => setFormVacuna({...formVacuna, nombre: e.target.value})} className={inputClass}>
                  <option value="">Seleccione tratamiento...</option>
                  <optgroup label="💉 Vacunas Bovinas (Anual)">
                    {LISTA_VACUNAS_ANUALES.map(v => <option key={v} value={v}>{v}</option>)}
                  </optgroup>
                  <optgroup label="🧴 Antiparasitarios y Baños">
                    {LISTA_CONTROL_PARASITARIO.map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                </select>
                <input type="date" required value={formVacuna.fecha} onChange={e => setFormVacuna({...formVacuna, fecha: e.target.value})} className={inputClass} />
                <input type="text" placeholder="Dosis (Ej. 2ml)" required value={formVacuna.dosis} onChange={e => setFormVacuna({...formVacuna, dosis: e.target.value})} className={inputClass} />
                <div className="flex gap-2 mt-2">
                  <button type="button" className={btnSecondary} onClick={() => setModalVacuna(false)}>Cancelar</button>
                  <button type="submit" className={btnPrimary}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalAlimento && (
          <div className={modalClass}>
            <div className={modalBoxClass}>
              <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Registrar Alimentación</h3>
              <form onSubmit={agregarAlimento} className="flex flex-col gap-3">
                <input type="text" placeholder="Tipo (Ej. Pasto, Concentrado)" required value={formAlimento.tipo} onChange={e => setFormAlimento({...formAlimento, tipo: e.target.value})} className={inputClass} />
                <input type="text" placeholder="Cantidad (Ej. 15 kg)" required value={formAlimento.cantidad} onChange={e => setFormAlimento({...formAlimento, cantidad: e.target.value})} className={inputClass} />
                <input type="date" required value={formAlimento.fecha} onChange={e => setFormAlimento({...formAlimento, fecha: e.target.value})} className={inputClass} />
                <div className="flex gap-2 mt-2">
                  <button type="button" className={btnSecondary} onClick={() => setModalAlimento(false)}>Cancelar</button>
                  <button type="submit" className={btnPrimary}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
      
      <footer className="p-3 text-center text-[11px] text-slate-500 border-t border-slate-200 bg-white">
        Ganado Fácil v2.0 • Sistema de Gestión
      </footer>
    </div>
  );
}