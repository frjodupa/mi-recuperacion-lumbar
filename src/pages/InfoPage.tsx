import { AlertTriangle, Database, FileText, RotateCcw, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { phases } from '../data/initialData';
import { rehabModules } from '../modules/rehabModules';
import { clearState, exportState, getLatestBackup, parseImportedState } from '../utils/storage';
import { Button, Card, ConfirmDialog, SafetyNotice } from '../components/ui';
import type { AppState, EquipmentKey, PhaseId } from '../types';

const sections = [
  ['Cómo utilizar la aplicación', 'Elige una rutina autorizada, marca los ejercicios realizados y registra dolor, fatiga y observaciones al finalizar.'],
  ['Señales de alerta', 'Detén el ejercicio ante dolor intenso, pérdida de fuerza, hormigueo progresivo, problemas de esfínteres, fiebre, problemas en la cicatriz, mareo, dificultad respiratoria o síntomas nuevos en las piernas.'],
  ['Consejos de seguridad', 'Prioriza movimientos lentos, zonas despejadas, calzado estable y descansos. No aumentes intensidad sin autorización.'],
  ['Higiene postural', 'Evita giros bruscos y cargas no autorizadas. Cambia de postura con frecuencia si te lo han recomendado.'],
  ['Cómo levantarse de la cama', 'Gira de lado, acerca las piernas al borde y usa los brazos para incorporarte sin impulsos bruscos.'],
  ['Cómo sentarse y levantarse', 'Usa una silla estable, pies apoyados y empuja con las piernas manteniendo el tronco controlado.'],
  ['Cómo caminar', 'Empieza con ritmo cómodo, superficie segura y duración pautada. Detén si aparece dolor o síntomas nuevos.'],
  ['Cómo registrar el dolor', 'Usa 0 como ausencia de dolor y 10 como dolor máximo imaginable. Registra antes y después.'],
  ['Aviso sanitario', 'Esta aplicación organiza información personal y no sustituye el seguimiento de un traumatólogo, rehabilitador o fisioterapeuta.'],
];

export function InfoPage({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [phaseConfirm, setPhaseConfirm] = useState<PhaseId | null>(null);
  const [importError, setImportError] = useState('');
  const [showFaq, setShowFaq] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const latestBackup = getLatestBackup();

  const importJson = async (file: File) => {
    try {
      const data = parseImportedState(await file.text());
      setImportError('');
      setState(data);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'No se pudo importar la copia.');
    }
  };

  const toggleEquipment = (key: EquipmentKey, checked: boolean) => {
    setState((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        equipment: {
          ...current.preferences.equipment,
          [key]: checked,
        },
      },
    }));
  };
  const updatePatientProfile = (patch: Partial<NonNullable<AppState['patientProfile']>>) => {
    setState((current) => {
      const now = new Date().toISOString();
      const patientProfile = {
        name: current.preferences.patientName || 'José',
        baselinePain: 2,
        baselineStiffness: 2,
        baselineFatigue: 3,
        baselineMobility: 'limited' as const,
        medicalExerciseAuthorization: 'unknown' as const,
        hasProfessionalRoutine: false,
        goals: ['Reducir dolor'],
        dailyGoalMinutes: 20,
        weeklyRehabDays: 5,
        remindersEnabled: false,
        createdAt: now,
        ...current.patientProfile,
        ...patch,
        updatedAt: now,
      };
      return {
        ...current,
        patientProfile,
        preferences: {
          ...current.preferences,
          patientName: patch.name || current.preferences.patientName,
          surgeryDate: patch.surgeryDate || current.preferences.surgeryDate,
        },
      };
    });
  };

  return (
    <div className="space-y-5">
      <div><h2 className="text-3xl font-bold text-petrol-700">Ajustes</h2><p className="text-slate-600">Preguntas frecuentes, seguridad, privacidad, fases y configuración.</p></div>
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Ayuda rápida</p>
            <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-petrol-700">Preguntas frecuentes</h3>
            <p className="mt-1 text-sm text-slate-600">{sections.length} respuestas sobre uso, seguridad y registro clínico.</p>
          </div>
          <button
            type="button"
            className="animate-soft inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-2xl border border-petrol-100 bg-petrol-500 px-5 font-bold text-white shadow-sm hover:-translate-y-0.5 hover:bg-petrol-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
            onClick={() => setShowFaq((current) => !current)}
            aria-expanded={showFaq}
          >
            {showFaq ? 'Ocultar' : 'Ver preguntas'}
            <span className="grid size-7 place-items-center rounded-full bg-white/16 text-lg leading-none">{showFaq ? '−' : '+'}</span>
          </button>
        </div>
        {showFaq && (
          <div className="mt-5 grid gap-3 border-t border-petrol-100 pt-5">
            {sections.map(([title, body]) => (
              <details key={title} className="group rounded-2xl border border-petrol-100 bg-white/60 p-4 shadow-sm transition open:bg-petrol-50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-petrol-700">
                  <span>{title}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-petrol-700 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-4xl leading-relaxed text-slate-600">{body}</p>
              </details>
            ))}
          </div>
        )}
      </Card>
      <SafetyNotice />
      <Card className="border-amber-200 bg-amber-50"><h3 className="flex items-center gap-2 text-xl font-bold text-amber-900"><AlertTriangle className="size-5" /> Detén el ejercicio y consulta con un profesional si aparece alguno de estos síntomas:</h3><ul className="mt-3 grid gap-1 text-sm font-semibold text-amber-900 sm:grid-cols-2"><li>Dolor intenso o repentino.</li><li>Dolor que aumenta claramente con el ejercicio.</li><li>Pérdida de fuerza.</li><li>Hormigueo o adormecimiento progresivo.</li><li>Alteraciones del control de esfínteres.</li><li>Fiebre.</li><li>Problemas en la cicatriz.</li><li>Mareo o dificultad respiratoria.</li><li>Síntomas nuevos en las piernas.</li></ul></Card>
      <Card><h3 className="text-xl font-bold text-petrol-700">Configuración por fases</h3><p className="mt-1 text-sm font-semibold text-amber-800">El cambio de fase debe confirmarlo tu médico o fisioterapeuta.</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{phases.map((phase) => <button key={phase.id} onClick={() => setPhaseConfirm(phase.id)} className={`rounded-xl border p-4 text-left ${state.preferences.activePhase === phase.id ? 'border-petrol-500 bg-petrol-50' : 'border-petrol-100 bg-white'}`}><span className="font-bold text-petrol-700">{phase.name}</span><span className="mt-1 block text-sm text-slate-600">{phase.description}</span><span className="mt-3 block rounded-lg bg-white px-3 py-2 text-center text-sm font-bold text-petrol-700">Cambiar de fase</span></button>)}</div></Card>
      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Mi equipamiento</h3>
        <p className="mt-1 text-sm text-slate-600">La Biblioteca usa esta configuración para mostrar qué ejercicios encajan con el material disponible. No cambia automáticamente tus rutinas.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {equipmentOptions.map((item) => (
            <label key={item.key} className={`flex min-h-14 items-center gap-3 rounded-xl border p-3 font-semibold ${state.preferences.equipment[item.key] ? 'border-petrol-100 bg-petrol-50 text-petrol-700' : 'border-app-border bg-white text-slate-600'}`}>
              <input className="size-5 accent-petrol-500" type="checkbox" checked={state.preferences.equipment[item.key]} onChange={(event) => toggleEquipment(item.key, event.target.checked)} />
              {item.label}
            </label>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Módulos de rehabilitación</h3>
        <p className="mt-1 text-sm text-slate-600">La arquitectura está preparada para crecer sin cambiar el núcleo de la app.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rehabModules.map((module) => <div key={module.id} className={`rounded-xl border p-3 ${module.enabled ? 'border-calmgreen bg-green-50' : 'border-petrol-100 bg-petrol-50'}`}><p className="font-bold text-petrol-700">{module.name}</p><p className="text-sm text-slate-600">{module.enabled ? 'Activo' : module.description}</p></div>)}
        </div>
      </Card>
      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Preferencias premium</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="font-semibold text-slate-700">Nombre del paciente<input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 p-3" value={state.patientProfile?.name || state.preferences.patientName || ''} onChange={(event) => updatePatientProfile({ name: event.target.value })} /></label>
          <label className="font-semibold text-slate-700">Fecha de operación<input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 p-3" type="date" value={state.patientProfile?.surgeryDate || state.preferences.surgeryDate || ''} onChange={(event) => updatePatientProfile({ surgeryDate: event.target.value })} /></label>
          <label className="font-semibold text-slate-700">Modo visual <select className="mt-1 block w-full rounded-xl border border-petrol-100 p-3" value={state.preferences.theme} onChange={(event) => setState((current) => ({ ...current, preferences: { ...current.preferences, theme: event.target.value as AppState['preferences']['theme'] } }))}><option value="system">Según el sistema</option><option value="light">Claro</option><option value="dark">Oscuro</option></select></label>
          <label className="font-semibold text-slate-700">Tamaño de texto <select className="mt-1 block w-full rounded-xl border border-petrol-100 p-3" value={state.preferences.textSize} onChange={(event) => setState((current) => ({ ...current, preferences: { ...current.preferences, textSize: event.target.value as AppState['preferences']['textSize'] } }))}><option value="normal">Normal</option><option value="large">Grande</option><option value="xlarge">Muy grande</option></select></label>
          {(['highContrast', 'soundEnabled', 'relaxingSoundEnabled', 'voiceGuidanceEnabled', 'vibrationEnabled', 'restMode', 'autoBackupEnabled'] as const).map((key) => <label key={key} className="flex items-center gap-3 rounded-xl border border-petrol-100 p-3 font-semibold text-slate-700"><input className="size-5 accent-petrol-500" type="checkbox" checked={Boolean(state.preferences[key])} onChange={(event) => setState((current) => ({ ...current, preferences: { ...current.preferences, [key]: event.target.checked } }))} /> {labels[key]}</label>)}
        </div>
      </Card>
      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Datos, copias y exportación profesional</h3>
        <p className="mt-2 font-semibold text-slate-700">Tus datos permanecen en este dispositivo. La estructura ya queda preparada para sincronización futura con cuenta o base de datos, pero esta versión no envía información a ningún servidor.</p>
        <div className="mt-3 rounded-xl bg-petrol-50 p-3 text-sm text-slate-700"><Database className="mr-2 inline size-4" /> Copia automática: {latestBackup ? `última copia ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(latestBackup.createdAt))}` : 'pendiente de generarse'}</div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap"><Button variant="secondary" onClick={() => exportState(state)}>Exportar copia JSON</Button><Button variant="ghost" onClick={() => fileInput.current?.click()}><Upload className="size-5" /> Importar copia JSON</Button><Button variant="ghost" onClick={() => window.print()}><FileText className="size-5" /> Exportar PDF profesional</Button><Button variant="danger" onClick={() => setConfirmReset(true)}><RotateCcw className="size-5" /> Reiniciar progreso</Button></div>
        {importError && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-app-danger">{importError}</p>}
        <input ref={fileInput} className="hidden" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importJson(event.target.files[0])} />
      </Card>
      {confirmReset && <ConfirmDialog title="Reiniciar progreso" body="Esta acción borra la información guardada en este dispositivo. No se puede deshacer." onConfirm={() => { clearState(); location.reload(); }} onCancel={() => setConfirmReset(false)} />}
      {phaseConfirm && <ConfirmDialog title="Cambiar de fase" body="Confirma este cambio solo si tu médico o fisioterapeuta lo ha autorizado." onConfirm={() => { setState((current) => ({ ...current, preferences: { ...current.preferences, activePhase: phaseConfirm } })); setPhaseConfirm(null); }} onCancel={() => setPhaseConfirm(null)} />}
    </div>
  );
}

const labels = {
  highContrast: 'Alto contraste',
  soundEnabled: 'Sonido al finalizar temporizador',
  relaxingSoundEnabled: 'Sonido relajante durante la rutina',
  voiceGuidanceEnabled: 'Voz guiada durante la rutina',
  vibrationEnabled: 'Vibración si el navegador lo permite',
  restMode: 'Modo descanso',
  autoBackupEnabled: 'Copias de seguridad automáticas',
};

const equipmentOptions: { key: EquipmentKey; label: string }[] = [
  { key: 'bench', label: 'Banco reclinable' },
  { key: 'dumbbells', label: 'Mancuernas' },
  { key: 'bands', label: 'Bandas elásticas' },
  { key: 'mat', label: 'Esterilla' },
  { key: 'chair', label: 'Silla estable' },
  { key: 'wall', label: 'Pared' },
  { key: 'walkingSpace', label: 'Espacio para caminar' },
  { key: 'stationaryBike', label: 'Bicicleta estática' },
  { key: 'treadmill', label: 'Cinta de correr' },
  { key: 'other', label: 'Otro material' },
];
