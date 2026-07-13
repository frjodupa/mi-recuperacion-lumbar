import { CalendarDays, HeartPulse, Moon, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { AppState, DailyCheckIn } from '../types';
import { Button, Card, PainScale, ResponsibilityNotice } from '../components/ui';
import type { PageId } from '../components/BottomNavigation';

const moods = ['Tranquilo', 'Animado', 'Cansado', 'Preocupado', 'Irritable'];

export function Home({ state, setState, setPage }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; setPage: (page: PageId) => void }) {
  const [localTime, setLocalTime] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setLocalTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const recommendedRoutine = useMemo(() => getRecommendedRoutine(state), [state]);
  const session = state.sessions.find((item) => item.date === today);
  const checkIn = state.checkIns.find((item) => item.date === today) || createDefaultCheckIn(today, recommendedRoutine.id);
  const percent = Math.round(((session?.completedExerciseIds.length || 0) / Math.max(1, recommendedRoutine.exercises.length)) * 100);
  const surgeryDays = getDaysSince(state.patientProfile?.surgeryDate || state.preferences.surgeryDate);
  const patientName = state.patientProfile?.name || state.preferences.patientName?.trim() || 'José';
  const timeContent = getTimeContent(localTime.getHours());
  const formattedToday = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const activePhase = state.preferences.activePhase.replace('fase-', 'Fase ');
  const nextAppointment = useMemo(
    () => [...state.medicalAppointments]
      .sort((a, b) => Date.parse(`${a.date}T${a.time || '00:00'}`) - Date.parse(`${b.date}T${b.time || '00:00'}`))
      .find((item) => Date.parse(`${item.date}T${item.time || '00:00'}`) >= Date.now()) || null,
    [state.medicalAppointments],
  );

  const updateCheckIn = (patch: Partial<DailyCheckIn>) => {
    setState((current) => ({ ...current, checkIns: [...current.checkIns.filter((item) => item.date !== today), { ...checkIn, ...patch, recommendedRoutineId: recommendedRoutine.id }] }));
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card className="overflow-hidden border-white/70 p-0">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-petrol-100/80 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-petrol-700 shadow-sm">
              <Sparkles className="size-3.5" /> Hoy
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-petrol-700 sm:text-5xl">
              {timeContent.greeting}, {patientName}
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">{formattedToday}</p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">Tu sesión de hoy está lista. Sigue con calma y sin presión.</p>
          </div>

          <div className="mt-8 rounded-[30px] border border-petrol-100/80 bg-white/82 p-5 shadow-[0_16px_50px_rgba(15,92,99,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-aqua">Tu sesión de hoy</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-petrol-700">{recommendedRoutine.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{recommendedRoutine.exercises.length} ejercicios · {Math.max(1, recommendedRoutine.exercises.length * 3)} minutos aprox.</p>
              </div>
              <Button className="w-full sm:w-auto" onClick={() => setPage('routine')}>Tu sesión de hoy</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card id="daily-check-in" className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-aqua">Panel de hoy</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-petrol-700">Tu estado actual</h3>
          </div>
          <div className="rounded-full border border-petrol-100 bg-petrol-50 px-3 py-1 text-sm font-semibold text-petrol-700">{activePhase}</div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric icon={CalendarDays} label="Días desde la cirugía" value={surgeryDays === null ? 'Configurar' : surgeryDays} tone="aqua" />
          <Metric icon={HeartPulse} label="Dolor de hoy" value={`${checkIn.pain}/10`} tone="petrol" />
          <Metric icon={Moon} label="Sueño" value={`${checkIn.sleepQuality ?? 7}/10`} tone="green" />
        </div>

        {nextAppointment && (
          <div className="mt-5 rounded-2xl border border-petrol-100 bg-petrol-50/70 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Proxima cita</p>
            <p className="mt-1 text-lg font-semibold text-petrol-700">{nextAppointment.specialty}</p>
            <p className="mt-1 text-sm text-slate-600">
              {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${nextAppointment.date}T12:00:00`))}
              {' · '}
              {nextAppointment.time}
              {' · '}
              {nextAppointment.medicalCenter || 'Centro no indicado'}
            </p>
            <Button variant="secondary" className="mt-3" onClick={() => setPage('profile')}>Ver detalles</Button>
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[24px] border border-petrol-100 bg-white/70 p-4 sm:p-5">
            <p className="text-sm font-semibold text-petrol-700">Antes de empezar</p>
            <div className="mt-4 space-y-4">
              <PainScale label="Dolor" value={checkIn.pain} onChange={(pain) => updateCheckIn({ pain })} />
              <PainScale label="Sueño" value={checkIn.sleepQuality ?? 7} onChange={(sleepQuality) => updateCheckIn({ sleepQuality })} />
              <label className="block font-semibold text-petrol-700">Estado de ánimo
                <select className="mt-2 min-h-11 w-full rounded-xl border border-petrol-100 bg-white/80 px-3" value={checkIn.mood || 'Tranquilo'} onChange={(event) => updateCheckIn({ mood: event.target.value, feeling: event.target.value })}>
                  {moods.map((mood) => <option key={mood}>{mood}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-[24px] border border-petrol-100 bg-white/70 p-4 sm:p-5">
            <p className="text-sm font-semibold text-petrol-700">Registro breve</p>
            <div className="mt-4 grid gap-4">
              <Scale label="Rigidez" value={checkIn.stiffness ?? 0} onChange={(stiffness) => updateCheckIn({ stiffness })} />
              <Scale label="Fatiga" value={checkIn.fatigue ?? 0} onChange={(fatigue) => updateCheckIn({ fatigue })} />
            </div>
          </div>
        </div>

        {checkIn.pain >= 7 && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-sm font-semibold text-amber-900">
            Hoy conviene pausar la sesión y consultar con un profesional si el dolor aumenta.
          </div>
        )}

        <ResponsibilityNotice withEscalation className="mt-5" />
      </Card>
    </div>
  );
}

export function getTimeContent(hour: number) {
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Buenos días', message: 'Cada pequeño paso de hoy fortalece tu recuperación.' };
  }
  if (hour >= 12 && hour < 20) {
    return { greeting: 'Buenas tardes', message: 'Tu constancia está construyendo el progreso que buscas.' };
  }
  return { greeting: 'Buenas noches', message: 'Descansar también forma parte de tu recuperación.' };
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof CalendarDays; label: string; value: string | number; tone: 'aqua' | 'petrol' | 'green' | 'slate' }) {
  const tones = {
    aqua: 'bg-aqua/12 text-petrol-700',
    petrol: 'bg-petrol-50 text-petrol-700',
    green: 'bg-green-50 text-calmgreen',
    slate: 'bg-slate-100 text-slate-700',
  };
  const isConfigAction = value === 'Configurar';
  return (
    <div className="premium-kpi kpi-card rounded-[26px] border border-white/70 p-5">
      <div className={`grid size-11 shrink-0 place-items-center rounded-[18px] ${tones[tone]}`}><Icon className="size-5" /></div>
      <p className="kpi-label mt-4 font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`kpi-value mt-3 font-bold tracking-[-0.02em] text-petrol-700 ${isConfigAction ? 'kpi-action-value' : ''}`}>{value}</p>
    </div>
  );
}

function Scale({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block font-semibold text-petrol-700">{label} <span className="rounded-full border border-petrol-100 bg-white/70 px-2 py-1 text-sm shadow-sm">{value}/10</span>
      <input className="mt-2 w-full" type="range" min="0" max="10" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function createDefaultCheckIn(date: string, routineId: string): DailyCheckIn {
  return { date, feeling: 'Tranquilo', pain: 2, stiffness: 2, fatigue: 3, sleepHours: 7, sleepQuality: 7, mood: 'Tranquilo', recommendedRoutineId: routineId };
}

function getRecommendedRoutine(state: AppState) {
  const day = new Date().getDay();
  return state.routines.find((routine) => routine.assignedDays.includes(day)) || state.routines[0];
}

function getDaysSince(date?: string) {
  if (!date) return null;
  const start = new Date(date);
  if (Number.isNaN(start.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
}

