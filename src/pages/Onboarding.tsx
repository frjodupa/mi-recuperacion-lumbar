import { ArrowRight, Camera, CheckCircle2, ChevronLeft, FileText, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { Button, Card } from '../components/ui';
import type { PatientProfile } from '../types';

const surgeryOptions = [
  { value: 'Artrodesis lumbar', label: 'Artrodesis lumbar' },
  { value: 'Microdiscectomía', label: 'Microdiscectomía' },
  { value: 'Laminectomía', label: 'Laminectomía' },
  { value: 'Otra', label: 'Otra' },
  { value: 'No estoy seguro', label: 'No estoy seguro' },
] as const;

const materialOptions = [
  { id: 'mat', label: 'Esterilla' },
  { id: 'chair', label: 'Silla estable' },
  { id: 'wall', label: 'Pared' },
  { id: 'walkingSpace', label: 'Espacio para caminar' },
  { id: 'bands', label: 'Bandas elásticas' },
  { id: 'bench', label: 'Banco' },
  { id: 'dumbbells', label: 'Mancuernas' },
  { id: 'stationaryBike', label: 'Bicicleta estática' },
] as const;

const steps = [
  { key: 'welcome', title: 'Bienvenido' },
  { key: 'name', title: 'Nombre' },
  { key: 'date', title: 'Fecha' },
  { key: 'surgery', title: 'Cirugía' },
  { key: 'report', title: 'Informe' },
  { key: 'materials', title: 'Material' },
  { key: 'summary', title: 'Resumen' },
] as const;

export function Onboarding({ onFinish }: { onFinish: (profile: PatientProfile) => void }) {
  const now = new Date().toISOString();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<PatientProfile>({
    name: 'José',
    baselinePain: 2,
    baselineStiffness: 2,
    baselineFatigue: 3,
    baselineMobility: 'limited',
    sleepHours: 7,
    sleepQuality: 7,
    medicalExerciseAuthorization: 'unknown',
    hasProfessionalRoutine: false,
    goals: ['Reducir dolor', 'Mejorar movilidad'],
    dailyGoalMinutes: 20,
    weeklyRehabDays: 5,
    remindersEnabled: false,
    createdAt: now,
    updatedAt: now,
  });
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['mat']);
  const [reportStatus, setReportStatus] = useState<'none' | 'camera' | 'file'>('none');
  const [reportFileName, setReportFileName] = useState('');
  const [accepted, setAccepted] = useState(false);

  const progressStep = step === 0 ? 0 : step;
  const progressPercent = Math.round((progressStep / 6) * 100);
  const daysSinceSurgery = getDaysSince(profile.surgeryDate);
  const canContinue = step === 1 ? profile.name.trim().length > 0 : step === 2 ? Boolean(profile.surgeryDate && !isFutureDate(profile.surgeryDate)) : step === 3 ? Boolean(profile.surgeryType) : true;

  const updateProfile = (patch: Partial<PatientProfile>) => {
    setProfile((current) => ({ ...current, ...patch, updatedAt: new Date().toISOString() }));
  };

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const handleReportSelection = (mode: 'camera' | 'file') => {
    setReportStatus(mode === 'camera' ? 'camera' : 'file');
    if (mode === 'file') {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setReportFileName(file?.name || 'Archivo seleccionado');
    setReportStatus('file');
  };

  const finish = () => {
    onFinish({
      ...profile,
      name: profile.name.trim() || 'Paciente',
      surgeryType: profile.surgeryType || 'Artrodesis lumbar',
      goals: profile.goals.length ? profile.goals : ['Recuperación segura'],
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(207,236,237,0.25),_transparent_55%)] p-3 sm:p-4">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center py-4 sm:py-8">
        <Card className="w-full overflow-hidden border-petrol-100/80 bg-white/90 p-0 shadow-[0_24px_60px_rgba(15,92,99,0.12)] backdrop-blur-xl">
          <div className="px-4 pb-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
            {step > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <span>Asistente</span>
                  <span>Paso {progressStep} de 6</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-petrol-100">
                  <div className="h-full rounded-full bg-petrol-500 transition-all duration-200 ease-out" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}

            <div className="rounded-[30px] border border-petrol-100/70 bg-gradient-to-br from-white via-petrol-50/60 to-white p-5 sm:p-7 lg:p-8">
              {step === 0 && (
                <div className="mx-auto max-w-2xl text-center">
                  <div className="mx-auto grid size-24 place-items-center rounded-[28px] bg-petrol-500 text-white shadow-[0_16px_40px_rgba(15,92,99,0.2)] sm:size-28">
                    <Sparkles className="size-11 sm:size-12" />
                  </div>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-aqua">Mi Recuperación Lumbar</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-petrol-700 sm:text-4xl">Bienvenido</h1>
                  <p className="mt-4 text-lg leading-relaxed text-slate-700">Vamos a preparar una experiencia adaptada a tu recuperación.</p>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">Solo necesitaremos unos minutos y podrás modificar estos datos más adelante.</p>
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-[20px] border border-petrol-100 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600">
                    <Lock className="size-4 text-petrol-600" />
                    Tus datos se guardan en este dispositivo.
                  </div>
                  <Button className="mt-7 h-14 w-full sm:w-auto sm:min-w-[220px]" onClick={() => setStep(1)}>
                    Comenzar
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              )}

              {step === 1 && (
                <div className="mx-auto max-w-2xl transition-all duration-200 ease-out motion-reduce:transition-none">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">Paso 1</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-petrol-700">¿Cómo te llamas?</h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">Usaremos tu nombre para personalizar la aplicación.</p>
                  <label className="mt-6 block">
                    <span className="sr-only">Nombre</span>
                    <input className="min-h-[56px] w-full rounded-[24px] border border-petrol-100 bg-white px-4 text-lg font-medium text-petrol-700 outline-none" placeholder="Escribe tu nombre" value={profile.name} onChange={(event) => updateProfile({ name: event.target.value })} />
                  </label>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button variant="ghost" className="flex-1" onClick={() => setStep(0)}>
                      <ChevronLeft className="size-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" disabled={!canContinue} onClick={() => setStep(2)}>
                      Continuar
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="mx-auto max-w-2xl transition-all duration-200 ease-out motion-reduce:transition-none">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">Paso 2</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-petrol-700">¿Cuándo fue tu cirugía?</h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">La fecha nos permite mostrar el tiempo transcurrido desde la intervención.</p>
                  <label className="mt-6 block">
                    <span className="sr-only">Fecha de cirugía</span>
                    <input className="min-h-[56px] w-full rounded-[24px] border border-petrol-100 bg-white px-4 text-lg font-medium text-petrol-700 outline-none" type="date" max={todayString()} value={profile.surgeryDate || ''} onChange={(event) => updateProfile({ surgeryDate: event.target.value })} />
                  </label>
                  <div className="mt-4 rounded-[22px] border border-petrol-100 bg-white/80 px-4 py-3 text-sm font-semibold text-petrol-700">
                    {profile.surgeryDate && !isFutureDate(profile.surgeryDate) ? `Han pasado ${daysSinceSurgery} días desde tu cirugía.` : 'Elige una fecha para ver el tiempo transcurrido.'}
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>
                      <ChevronLeft className="size-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" disabled={!canContinue} onClick={() => setStep(3)}>
                      Continuar
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mx-auto max-w-3xl transition-all duration-200 ease-out motion-reduce:transition-none">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">Paso 3</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-petrol-700">¿Qué intervención te realizaron?</h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">La experiencia seguirá centrada prioritariamente en la artrodesis lumbar, pero podrás ajustar el contexto si tu caso es diferente.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {surgeryOptions.map((option) => {
                      const selected = profile.surgeryType === option.value;
                      return (
                        <button key={option.value} type="button" className={`rounded-[24px] border p-4 text-left transition ${selected ? 'border-petrol-500 bg-petrol-500 text-white shadow-sm' : 'border-petrol-100 bg-white text-petrol-700 hover:border-petrol-200'}`} onClick={() => updateProfile({ surgeryType: option.value })}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-base font-semibold">{option.label}</span>
                            <span className={`grid size-8 place-items-center rounded-full ${selected ? 'bg-white/20' : 'bg-petrol-50'}`}>
                              <CheckCircle2 className="size-4" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button variant="ghost" className="flex-1" onClick={() => setStep(2)}>
                      <ChevronLeft className="size-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" disabled={!canContinue} onClick={() => setStep(4)}>
                      Continuar
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="mx-auto max-w-3xl transition-all duration-200 ease-out motion-reduce:transition-none">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">Paso 4</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-petrol-700">Añade tu informe médico</h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">Puedes hacer una fotografía o seleccionar un PDF. Más adelante, el asistente podrá ayudarte a identificar y explicar la información relevante.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <button type="button" className="rounded-[24px] border border-petrol-100 bg-white p-4 text-left text-petrol-700 transition hover:border-petrol-300" onClick={() => handleReportSelection('camera')}>
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-2xl bg-petrol-50"><Camera className="size-5" /></span>
                        <span className="font-semibold">Hacer fotografía</span>
                      </div>
                    </button>
                    <button type="button" className="rounded-[24px] border border-petrol-100 bg-white p-4 text-left text-petrol-700 transition hover:border-petrol-300" onClick={() => handleReportSelection('file')}>
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-2xl bg-petrol-50"><FileText className="size-5" /></span>
                        <span className="font-semibold">Seleccionar archivo</span>
                      </div>
                    </button>
                    <button type="button" className="rounded-[24px] border border-petrol-100 bg-petrol-50 p-4 text-left text-petrol-700 transition hover:border-petrol-200" onClick={() => { setReportStatus('none'); setReportFileName(''); setStep(5); }}>
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-2xl bg-white"><ShieldCheck className="size-5" /></span>
                        <span className="font-semibold">Continuar sin informe</span>
                      </div>
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelection} />
                  {reportStatus !== 'none' && (
                    <div className="mt-5 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      {reportStatus === 'camera' ? 'La fotografía queda preparada para el siguiente paso.' : reportFileName || 'Archivo preparado para la siguiente pantalla.'}
                    </div>
                  )}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button variant="ghost" className="flex-1" onClick={() => setStep(3)}>
                      <ChevronLeft className="size-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" onClick={() => setStep(5)}>
                      Continuar
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="mx-auto max-w-3xl transition-all duration-200 ease-out motion-reduce:transition-none">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">Paso 5</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-petrol-700">¿Qué material tienes disponible?</h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">Elige los elementos que ya tienes a mano para adaptar la experiencia.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {materialOptions.map((item) => {
                      const selected = selectedMaterials.includes(item.id);
                      return (
                        <button key={item.id} type="button" className={`rounded-[24px] border p-4 text-left transition ${selected ? 'border-petrol-500 bg-petrol-500 text-white shadow-sm' : 'border-petrol-100 bg-white text-petrol-700 hover:border-petrol-200'}`} onClick={() => toggleMaterial(item.id)}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-base font-semibold">{item.label}</span>
                            <span className={`grid size-8 place-items-center rounded-full ${selected ? 'bg-white/20' : 'bg-petrol-50'}`}>
                              <CheckCircle2 className="size-4" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button variant="ghost" className="flex-1" onClick={() => setStep(4)}>
                      <ChevronLeft className="size-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" onClick={() => setStep(6)}>
                      Continuar
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="mx-auto max-w-3xl transition-all duration-200 ease-out motion-reduce:transition-none">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">Paso 6</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-petrol-700">Todo preparado</h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">Revisa los datos básicos y entra en tu recuperación con tranquilidad.</p>
                  <div className="mt-6 space-y-3 rounded-[24px] border border-petrol-100 bg-white/80 p-4">
                    <SummaryRow label="Nombre" value={profile.name.trim() || 'Paciente'} />
                    <SummaryRow label="Fecha de cirugía" value={profile.surgeryDate ? new Date(profile.surgeryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pendiente'} />
                    <SummaryRow label="Tipo de intervención" value={profile.surgeryType || 'Artrodesis lumbar'} />
                    <SummaryRow label="Informe añadido" value={reportStatus === 'none' ? 'Pendiente' : reportFileName || (reportStatus === 'camera' ? 'Fotografía preparada' : 'Archivo preparado')} />
                    <SummaryRow label="Material disponible" value={selectedMaterials.length ? selectedMaterials.map((id) => materialOptions.find((option) => option.id === id)?.label).filter(Boolean).join(', ') : 'Sin material seleccionado'} />
                  </div>
                  <div className="mt-5 rounded-[24px] border border-amber-200/80 bg-amber-50/80 p-4 text-sm font-semibold leading-relaxed text-amber-900">
                    Esta aplicación acompaña tu recuperación, pero no sustituye las indicaciones de tu médico, rehabilitador o fisioterapeuta.
                  </div>
                  <label className="mt-5 flex items-start gap-3 rounded-[24px] border border-petrol-100 bg-white/80 p-4 text-sm font-semibold text-slate-700">
                    <input className="mt-1 size-5 accent-petrol-500" type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
                    <span>He leído y comprendo este aviso.</span>
                  </label>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button variant="ghost" className="flex-1" onClick={() => setStep(5)}>
                      <ChevronLeft className="size-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" disabled={!accepted} onClick={() => finish()}>
                      Entrar en mi recuperación
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-petrol-100 bg-white/80 px-4 py-3 text-sm">
      <span className="font-semibold text-petrol-700">{label}</span>
      <span className="text-right text-slate-600">{value}</span>
    </div>
  );
}

function todayString() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function isFutureDate(date?: string) {
  if (!date) return false;
  const selected = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected > today;
}

function getDaysSince(date?: string) {
  if (!date) return null;
  const start = new Date(date);
  if (Number.isNaN(start.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
}
