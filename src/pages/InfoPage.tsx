import { Database, FileText, Info, RotateCcw, ShieldCheck, Star, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { clearState, exportState, getLatestBackup, parseImportedState } from '../utils/storage';
import { Button, Card, ConfirmDialog, ResponsibilityNotice } from '../components/ui';
import type { PageId } from '../components/BottomNavigation';
import type { AppState, EquipmentKey } from '../types';
import { DocumentUploadFlow } from '../components/documents/DocumentUploadFlow';
import { DocumentsList } from '../components/documents/DocumentsList';
import { DocumentsTimeline } from '../components/documents/DocumentsTimeline';
import { DocumentSummaryView } from '../components/documents/DocumentSummaryView';
import { saveDocumentFile } from '../services/documents/documentStore';
import { MedicalAgendaSection } from '../components/agenda/MedicalAgendaSection';

const faqItems: Array<{ question: string; answer: string }> = [
  {
    question: '¿Cómo funciona la aplicación?',
    answer: 'Te guía en tu sesión diaria, registra tu progreso y conserva tu información en este dispositivo.',
  },
  {
    question: '¿Cómo subir un informe?',
    answer: 'Puedes seleccionar un archivo en onboarding. El análisis avanzado seguirá evolucionando en próximas fases.',
  },
  {
    question: '¿Qué hace la IA?',
    answer: 'La IA está orientada a apoyo informativo y comprensión del proceso, sin sustituir indicaciones de profesionales sanitarios.',
  },
  {
    question: '¿Dónde se guardan mis datos?',
    answer: 'Los datos se guardan localmente en el navegador de este dispositivo.',
  },
  {
    question: '¿Cómo se protege mi privacidad?',
    answer: 'Esta versión no envía datos clínicos a servidores externos y prioriza un modelo local-first.',
  },
];

export function InfoPage({ state, setState, setPage }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; setPage: (page: PageId) => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [importError, setImportError] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const latestBackup = getLatestBackup();
  const selectedDocument = state.medicalDocuments.find((item) => item.id === selectedDocumentId) || null;

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

  const handleSaveMedicalDocument = async ({
    file,
    analysis,
    thumbnailDataUrl,
  }: {
    file: File;
    analysis: AppState['medicalDocuments'][number]['analysis'];
    thumbnailDataUrl?: string;
  }) => {
    const objectStoreKey = await saveDocumentFile(file);
    const now = new Date().toISOString();
    setState((current) => ({
      ...current,
      medicalDocuments: [
        {
          id: crypto.randomUUID(),
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          uploadedAt: now,
          objectStoreKey,
          thumbnailDataUrl,
          analysis,
        },
        ...current.medicalDocuments,
      ],
    }));
  };

  return (
    <div className="space-y-7 sm:space-y-8">
      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Preferencias</p>
        <Card className="mt-3 p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="font-semibold text-slate-700">Nombre del paciente<input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 p-3" value={state.patientProfile?.name || state.preferences.patientName || ''} onChange={(event) => updatePatientProfile({ name: event.target.value })} /></label>
            <label className="font-semibold text-slate-700">Fecha de operación<input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 p-3" type="date" value={state.patientProfile?.surgeryDate || state.preferences.surgeryDate || ''} onChange={(event) => updatePatientProfile({ surgeryDate: event.target.value })} /></label>
            <label className="font-semibold text-slate-700">Modo visual <select className="mt-1 block w-full rounded-xl border border-petrol-100 p-3" value={state.preferences.theme} onChange={(event) => setState((current) => ({ ...current, preferences: { ...current.preferences, theme: event.target.value as AppState['preferences']['theme'] } }))}><option value="system">Según el sistema</option><option value="light">Claro</option><option value="dark">Oscuro</option></select></label>
            <label className="font-semibold text-slate-700">Tamaño del texto <select className="mt-1 block w-full rounded-xl border border-petrol-100 p-3" value={state.preferences.textSize} onChange={(event) => setState((current) => ({ ...current, preferences: { ...current.preferences, textSize: event.target.value as AppState['preferences']['textSize'] } }))}><option value="normal">Normal</option><option value="large">Grande</option><option value="xlarge">Muy grande</option></select></label>
          </div>

          <details className="group mt-5 rounded-2xl border border-petrol-100 bg-white/70 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-petrol-700">
              Ajustes avanzados actuales
              <span className="grid size-8 place-items-center rounded-full bg-petrol-50 text-petrol-700 transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(['highContrast', 'soundEnabled', 'relaxingSoundEnabled', 'voiceGuidanceEnabled', 'vibrationEnabled', 'restMode', 'autoBackupEnabled'] as const).map((key) => <label key={key} className="flex items-center gap-3 rounded-xl border border-petrol-100 bg-white p-3 font-semibold text-slate-700"><input className="size-5 accent-petrol-500" type="checkbox" checked={Boolean(state.preferences[key])} onChange={(event) => setState((current) => ({ ...current, preferences: { ...current.preferences, [key]: event.target.checked } }))} /> {labels[key]}</label>)}
            </div>
          </details>

          <details className="group mt-4 rounded-2xl border border-petrol-100 bg-white/70 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-petrol-700">
              Material disponible
              <span className="grid size-8 place-items-center rounded-full bg-petrol-50 text-petrol-700 transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {equipmentOptions.map((item) => (
                <label key={item.key} className={`flex min-h-12 items-center gap-3 rounded-xl border p-3 font-semibold ${state.preferences.equipment[item.key] ? 'border-petrol-100 bg-petrol-50 text-petrol-700' : 'border-app-border bg-white text-slate-600'}`}>
                  <input className="size-5 accent-petrol-500" type="checkbox" checked={state.preferences.equipment[item.key]} onChange={(event) => toggleEquipment(item.key, event.target.checked)} />
                  {item.label}
                </label>
              ))}
            </div>
          </details>

          <details className="group mt-4 rounded-2xl border border-petrol-100 bg-white/70 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-petrol-700">
              Datos y copias
              <span className="grid size-8 place-items-center rounded-full bg-petrol-50 text-petrol-700 transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-petrol-50 p-3 text-sm text-slate-700"><Database className="mr-2 inline size-4" /> Copia automática: {latestBackup ? `última copia ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(latestBackup.createdAt))}` : 'pendiente de generarse'}</div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"><Button variant="secondary" onClick={() => exportState(state)}>Exportar copia JSON</Button><Button variant="ghost" onClick={() => fileInput.current?.click()}><Upload className="size-5" /> Importar copia JSON</Button><Button variant="ghost" onClick={() => window.print()}><FileText className="size-5" /> Exportar PDF profesional</Button><Button variant="danger" onClick={() => setConfirmReset(true)}><RotateCcw className="size-5" /> Reiniciar progreso</Button></div>
              {importError && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-app-danger">{importError}</p>}
            </div>
          </details>
          <input ref={fileInput} className="hidden" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importJson(event.target.files[0])} />
        </Card>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Mis informes</p>
        <Card className="mt-3 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-petrol-700">Documentación clínica</h3>
              <p className="text-sm text-slate-600">Organiza informes PDF e imágenes con resumen y extracción objetiva.</p>
            </div>
            <Button onClick={() => setUploadOpen(true)}>📄 Añadir informe</Button>
          </div>

          <div className="mt-5">
            <DocumentsList documents={state.medicalDocuments} onOpen={setSelectedDocumentId} />
          </div>

          <ResponsibilityNotice withEscalation className="mt-5" />

          <div className="mt-6 rounded-2xl border border-petrol-100 bg-petrol-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Línea temporal</p>
            <div className="mt-3">
              <DocumentsTimeline documents={state.medicalDocuments} />
            </div>
          </div>
        </Card>
      </section>

      <MedicalAgendaSection state={state} setState={setState} />

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Preguntas frecuentes</p>
        <Card className="mt-3 p-5 sm:p-6">
          <details className="group rounded-2xl border border-petrol-100 bg-white/70 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-petrol-700">
              Ver preguntas frecuentes
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-petrol-50 text-petrol-700 transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 space-y-3">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-xl border border-petrol-100 bg-white p-3">
                  <p className="font-semibold text-petrol-700">{item.question}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </details>
        </Card>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Recomendaciones y seguridad</p>
        <Card className="mt-3 p-5 sm:p-6">
          <p className="text-sm text-slate-600">Consulta el detalle completo de medidas de protección, alcance y buenas prácticas de privacidad.</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => setPage('security-privacy')}>Abrir Seguridad y Privacidad</Button>
          </div>
        </Card>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Acerca de la aplicación</p>
        <Card className="mt-3 p-5 sm:p-6">
          <div className="space-y-3">
            <AboutRow label="Versión" value="v1.0.8" />
            <AboutRow label="Contacto" value="Redcrea24.es" />
            <AboutRow label="Política de privacidad" value="Abrir" onClick={() => setPage('privacy-policy')} />
            <AboutRow label="Aviso legal" value="Abrir" onClick={() => setPage('legal-notice')} />
            <AboutRow label="Créditos" value="Equipo Mi Recuperación Lumbar" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="animate-soft inline-flex min-h-11 items-center gap-2 rounded-xl border border-petrol-100 bg-white px-4 text-sm font-semibold text-petrol-700 hover:bg-petrol-50" onClick={() => setPage('about')}><Info className="size-4" /> Ver detalles</button>
            <p className="inline-flex min-h-11 items-center gap-2 px-1 text-sm text-slate-600"><ShieldCheck className="size-4 text-calmgreen" /> Datos locales en este dispositivo</p>
            <p className="inline-flex min-h-11 items-center gap-2 px-1 text-sm text-slate-600"><Star className="size-4 text-petrol-600" /> Experiencia premium en evolución</p>
          </div>
        </Card>
      </section>

      {confirmReset && <ConfirmDialog title="Reiniciar progreso" body="Esta acción borra la información guardada en este dispositivo. No se puede deshacer." onConfirm={() => { clearState(); location.reload(); }} onCancel={() => setConfirmReset(false)} />}
      {uploadOpen && <DocumentUploadFlow onClose={() => setUploadOpen(false)} onConfirm={handleSaveMedicalDocument} />}
      {selectedDocument && <DocumentSummaryView document={selectedDocument} onClose={() => setSelectedDocumentId(null)} />}
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

function AboutRow({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-3 rounded-xl border border-petrol-100 bg-white/70 px-4 py-3 text-left transition hover:bg-petrol-50">
        <span className="text-sm font-semibold text-petrol-700">{label}</span>
        <span className="text-sm text-slate-600">{value}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-petrol-100 bg-white/70 px-4 py-3">
      <span className="text-sm font-semibold text-petrol-700">{label}</span>
      <span className="text-sm text-slate-600">{value}</span>
    </div>
  );
}
