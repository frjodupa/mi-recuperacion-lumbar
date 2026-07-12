import { Activity, CalendarDays, CheckCircle2, ClipboardList, HeartPulse, ShieldCheck, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button, Card, SafetyNotice } from '../components/ui';
import { ProgressIndicator } from '../components/premium';
import type { PatientProfile } from '../types';

const mobilityOptions: { value: PatientProfile['baselineMobility']; label: string }[] = [
  { value: 'very-limited', label: 'Muy limitada' },
  { value: 'limited', label: 'Limitada' },
  { value: 'moderate', label: 'Moderada' },
  { value: 'good', label: 'Buena' },
];

const genderOptions: { value: NonNullable<PatientProfile['gender']>; label: string }[] = [
  { value: 'female', label: 'Mujer' },
  { value: 'male', label: 'Hombre' },
  { value: 'other', label: 'Otro' },
  { value: 'prefer-not-to-say', label: 'Prefiero no indicarlo' },
];

const goalOptions = ['Reducir dolor', 'Mejorar movilidad', 'Caminar con más confianza', 'Ganar fuerza segura', 'Dormir mejor', 'Volver a actividades diarias'];

const steps = [
  { title: 'Datos del paciente', icon: ClipboardList },
  { title: 'Cirugía y rehabilitación', icon: CalendarDays },
  { title: 'Estado inicial', icon: HeartPulse },
  { title: 'Objetivos y seguridad', icon: Target },
];

export function Onboarding({ onFinish }: { onFinish: (profile: PatientProfile) => void }) {
  const now = useMemo(() => new Date().toISOString(), []);
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
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
  const StepIcon = steps[step].icon;
  const final = step === steps.length - 1;
  const canContinue = profile.name.trim().length > 0 && (!final || accepted);
  const errorMessage = !profile.name.trim() ? 'Indica al menos el nombre del paciente para personalizar la app.' : final && !accepted ? 'Acepta el aviso sanitario para finalizar la configuración.' : '';

  const updateProfile = (patch: Partial<PatientProfile>) => {
    setProfile((current) => ({ ...current, ...patch, updatedAt: new Date().toISOString() }));
  };

  const toggleGoal = (goal: string) => {
    updateProfile({
      goals: profile.goals.includes(goal) ? profile.goals.filter((item) => item !== goal) : [...profile.goals, goal],
    });
  };

  const finish = () => {
    onFinish({
      ...profile,
      name: profile.name.trim() || 'Paciente',
      goals: profile.goals.length ? profile.goals : ['Recuperación segura'],
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <main className="app-surface min-h-screen p-4">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl place-items-center py-8">
        <Card className="w-full overflow-hidden p-0">
          <div className="grid lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="bg-petrol-50 p-6 sm:p-8">
              <div className="grid size-16 place-items-center rounded-[24px] bg-petrol-500 text-white shadow-[0_16px_40px_rgba(15,92,99,0.2)]">
                <Activity className="size-8" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-aqua">Mi Recuperación Lumbar</p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-petrol-700">Configuración inicial</h1>
              <p className="mt-3 leading-relaxed text-slate-600">Prepara tu perfil para personalizar el panel, objetivos y seguimiento sin alterar tus rutinas ni historial.</p>
              <div className="mt-8 space-y-3">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === step;
                  const complete = index < step;
                  return (
                    <div key={item.title} className={`flex items-center gap-3 rounded-2xl border p-3 ${active ? 'border-petrol-500 bg-white text-petrol-700 shadow-sm' : 'border-petrol-100 bg-white/50 text-slate-600'}`}>
                      <span className={`grid size-10 place-items-center rounded-xl ${active || complete ? 'bg-petrol-500 text-white' : 'bg-white text-slate-500'}`}>
                        {complete ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                      </span>
                      <span className="font-bold">{item.title}</span>
                    </div>
                  );
                })}
              </div>
            </aside>

            <section className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 space-y-5">
                <ProgressIndicator current={step + 1} total={steps.length} />
                <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-petrol-50 text-petrol-700"><StepIcon className="size-6" /></div>
                <div>
                  <p className="text-sm font-bold text-aqua">Paso {step + 1} de {steps.length}</p>
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-petrol-700">{steps[step].title}</h2>
                </div>
                </div>
              </div>

              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre">
                    <input className="field-input" value={profile.name} onChange={(event) => updateProfile({ name: event.target.value })} />
                  </Field>
                  <Field label="Fecha de nacimiento">
                    <input className="field-input" type="date" value={profile.birthDate || ''} onChange={(event) => updateProfile({ birthDate: event.target.value })} />
                  </Field>
                  <Field label="Género">
                    <select className="field-input" value={profile.gender || 'prefer-not-to-say'} onChange={(event) => updateProfile({ gender: event.target.value as PatientProfile['gender'] })}>
                      {genderOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Altura">
                    <input className="field-input" type="number" min="100" max="230" placeholder="cm" value={profile.heightCm || ''} onChange={(event) => updateProfile({ heightCm: toNumber(event.target.value) })} />
                  </Field>
                  <Field label="Peso">
                    <input className="field-input" type="number" min="30" max="220" step="0.1" placeholder="kg" value={profile.weightKg || ''} onChange={(event) => updateProfile({ weightKg: toNumber(event.target.value) })} />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tipo de cirugía">
                    <input className="field-input" placeholder="Artrodesis lumbar" value={profile.surgeryType || ''} onChange={(event) => updateProfile({ surgeryType: event.target.value })} />
                  </Field>
                  <Field label="Fecha de operación">
                    <input className="field-input" type="date" value={profile.surgeryDate || ''} onChange={(event) => updateProfile({ surgeryDate: event.target.value })} />
                  </Field>
                  <Field label="Nivel lumbar">
                    <input className="field-input" placeholder="Ej. L4-L5, L5-S1" value={profile.lumbarLevel || ''} onChange={(event) => updateProfile({ lumbarLevel: event.target.value })} />
                  </Field>
                  <Field label="Hospital o centro">
                    <input className="field-input" value={profile.hospital || ''} onChange={(event) => updateProfile({ hospital: event.target.value })} />
                  </Field>
                  <Field label="Profesional de referencia">
                    <input className="field-input" value={profile.professionalName || ''} onChange={(event) => updateProfile({ professionalName: event.target.value })} />
                  </Field>
                  <Field label="Inicio de rehabilitación">
                    <input className="field-input" type="date" value={profile.rehabilitationStartDate || ''} onChange={(event) => updateProfile({ rehabilitationStartDate: event.target.value })} />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <RangeField label="Dolor inicial" value={profile.baselinePain} onChange={(baselinePain) => updateProfile({ baselinePain })} />
                    <RangeField label="Rigidez inicial" value={profile.baselineStiffness} onChange={(baselineStiffness) => updateProfile({ baselineStiffness })} />
                    <RangeField label="Fatiga inicial" value={profile.baselineFatigue} onChange={(baselineFatigue) => updateProfile({ baselineFatigue })} />
                    <RangeField label="Calidad del sueño" value={profile.sleepQuality || 7} onChange={(sleepQuality) => updateProfile({ sleepQuality })} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Horas de sueño habituales">
                      <input className="field-input" type="number" min="0" max="14" step="0.5" value={profile.sleepHours || ''} onChange={(event) => updateProfile({ sleepHours: toNumber(event.target.value) })} />
                    </Field>
                    <Field label="Movilidad inicial">
                      <select className="field-input" value={profile.baselineMobility} onChange={(event) => updateProfile({ baselineMobility: event.target.value as PatientProfile['baselineMobility'] })}>
                        {mobilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <SafetyNotice />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Autorización para ejercicio terapéutico">
                      <select className="field-input" value={profile.medicalExerciseAuthorization} onChange={(event) => updateProfile({ medicalExerciseAuthorization: event.target.value as PatientProfile['medicalExerciseAuthorization'] })}>
                        <option value="yes">Sí, autorizado</option>
                        <option value="no">No autorizado todavía</option>
                        <option value="unknown">No lo sé / pendiente</option>
                      </select>
                    </Field>
                    <Field label="Hora preferida">
                      <input className="field-input" type="time" value={profile.preferredSessionTime || ''} onChange={(event) => updateProfile({ preferredSessionTime: event.target.value })} />
                    </Field>
                    <Field label="Objetivo diario">
                      <input className="field-input" type="number" min="5" max="120" value={profile.dailyGoalMinutes} onChange={(event) => updateProfile({ dailyGoalMinutes: Number(event.target.value) || 20 })} />
                    </Field>
                    <Field label="Días semanales">
                      <input className="field-input" type="number" min="1" max="7" value={profile.weeklyRehabDays} onChange={(event) => updateProfile({ weeklyRehabDays: Number(event.target.value) || 5 })} />
                    </Field>
                  </div>
                  <label className="flex items-center gap-3 rounded-2xl border border-petrol-100 bg-white/60 p-4 font-semibold text-slate-700">
                    <input className="size-5 accent-petrol-500" type="checkbox" checked={profile.hasProfessionalRoutine} onChange={(event) => updateProfile({ hasProfessionalRoutine: event.target.checked })} />
                    Tengo una pauta indicada por un profesional.
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-petrol-100 bg-white/60 p-4 font-semibold text-slate-700">
                    <input className="size-5 accent-petrol-500" type="checkbox" checked={profile.remindersEnabled} onChange={(event) => updateProfile({ remindersEnabled: event.target.checked })} />
                    Activar recordatorios cuando estén disponibles.
                  </label>
                  <div>
                    <p className="mb-3 font-bold text-petrol-700">Objetivos personales</p>
                    <div className="flex flex-wrap gap-2">
                      {goalOptions.map((goal) => (
                        <button key={goal} type="button" className={`min-h-10 rounded-full border px-4 text-sm font-bold ${profile.goals.includes(goal) ? 'border-petrol-500 bg-petrol-500 text-white' : 'border-petrol-100 bg-white text-petrol-700'}`} onClick={() => toggleGoal(goal)}>
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Notas clínicas o personales">
                    <textarea className="field-input min-h-24" value={profile.notes || ''} onChange={(event) => updateProfile({ notes: event.target.value })} />
                  </Field>
                  <label className="flex gap-3 rounded-2xl border border-petrol-100 bg-petrol-50 p-4 text-sm font-semibold text-slate-700">
                    <input className="mt-1 size-5 accent-petrol-500" type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
                    He leído y comprendo que esta aplicación organiza mi recuperación, pero no sustituye el criterio de mi médico, rehabilitador o fisioterapeuta.
                  </label>
                </div>
              )}

              {errorMessage && <p className="mt-5 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">{errorMessage}</p>}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {step > 0 && <Button className="flex-1" variant="ghost" onClick={() => setStep((current) => current - 1)}>Atrás</Button>}
                <Button className="flex-1" disabled={!canContinue} onClick={() => {
                  if (!canContinue) return;
                  final ? finish() : setStep((current) => current + 1);
                }}>{final ? 'Guardar perfil y empezar' : 'Continuar'}</Button>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block font-semibold text-petrol-700">{label}<div className="mt-2">{children}</div></label>;
}

function RangeField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-2xl border border-petrol-100 bg-white/60 p-4 font-semibold text-petrol-700">
      <span className="flex items-center justify-between gap-3">{label}<strong>{value}/10</strong></span>
      <input className="mt-3 w-full" type="range" min="0" max="10" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function toNumber(value: string) {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
