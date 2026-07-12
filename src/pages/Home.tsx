import { CalendarDays, CheckCircle2, Flame, MessageCircle, Play, Search, Sparkles, Target, TimerReset } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { AppState, DailyCheckIn } from '../types';
import { Button, Card, PainScale, ProgressRing, SafetyNotice } from '../components/ui';
import type { PageId } from '../components/BottomNavigation';

const moods = ['Tranquilo', 'Animado', 'Cansado', 'Preocupado', 'Irritable'];
const quotes = ['La recuperación no consiste en correr, sino en avanzar con seguridad.', 'Cada movimiento controlado cuenta.', 'La constancia vale más que la intensidad.', 'Escucha tu cuerpo y respeta tu proceso.'];

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
  const totalMinutes = state.sessions.reduce((sum, item) => sum + item.durationMinutes, 0);
  const streak = calculateCurrentStreak(state.sessions);
  const dailyGoal = state.patientProfile?.dailyGoalMinutes || Math.max(1, Math.round((recommendedRoutine.exercises.length || 1) * 3));
  const surgeryDays = getDaysSince(state.patientProfile?.surgeryDate || state.preferences.surgeryDate);
  const patientName = state.patientProfile?.name || state.preferences.patientName?.trim() || 'José';
  const quote = quotes[new Date().getDay() % quotes.length];
  const timeContent = getTimeContent(localTime.getHours());

  const updateCheckIn = (patch: Partial<DailyCheckIn>) => {
    setState((current) => ({ ...current, checkIns: [...current.checkIns.filter((item) => item.date !== today), { ...checkIn, ...patch, recommendedRoutineId: recommendedRoutine.id }] }));
  };

  return (
    <div className="space-y-5">
      <SafetyNotice />

      <Card className="premium-hero p-6 sm:p-8 lg:p-10">
        <div className="relative z-10 grid min-w-0 gap-8 2xl:grid-cols-[minmax(0,1fr)_340px] 2xl:items-center">
          <div className="min-w-0 space-y-6">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-petrol-100 bg-white/70 px-3 py-1 text-sm font-bold text-petrol-700 shadow-sm"><CalendarDays className="size-4" /> Asistente diario</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-petrol-700 sm:text-5xl">{timeContent.greeting}, {patientName}.</h2>
              <p className="mt-3 text-lg text-slate-600">{new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</p>
              <p className="motivational-message mt-2 flex items-start gap-2 text-sm font-medium leading-relaxed text-slate-500 sm:items-center sm:text-base">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-aqua sm:mt-0" aria-hidden />
                <span>{timeContent.message}</span>
              </p>
            </div>
            <div className="dashboard-kpi-grid">
              <Metric icon={CalendarDays} label="Días desde la operación" value={surgeryDays === null ? 'Configurar' : surgeryDays} tone="aqua" />
              <Metric icon={TimerReset} label="Tiempo total rehabilitado" value={`${totalMinutes} min`} tone="petrol" />
              <Metric icon={Flame} label="Racha de días" value={`${streak} d`} tone="green" />
              <Metric icon={Target} label="Objetivo diario" value={`${dailyGoal} min`} tone="slate" />
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Sesión recomendada</p>
                <p className="mt-1 text-xl font-bold tracking-[-0.02em] text-petrol-700">{recommendedRoutine.name}</p>
                <p className="mt-1 text-sm text-slate-600">{recommendedRoutine.exercises.length} ejercicios programados · enfoque suave y controlado</p>
              </div>
              <Button className="w-full px-6 py-4 text-base sm:w-auto" onClick={() => setPage('routine')}><Play className="size-5" /> Comenzar</Button>
            </div>
          </div>
          <div className="dashboard-progress-panel mx-auto grid place-items-center gap-4 rounded-[32px] border border-white/70 bg-white/58 p-6 shadow-soft backdrop-blur 2xl:mx-0">
            <ProgressRing percent={percent} />
            <div className="text-center">
              <p className="font-bold text-petrol-700">Progreso de hoy</p>
              <p className="text-sm text-slate-600">{session?.completedExerciseIds.length || 0} ejercicios completados</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <h3 className="text-xl font-bold text-petrol-700">Antes de comenzar</h3>
        <p className="mt-1 text-sm text-slate-600">Estos datos ayudan a contextualizar la sesión y el historial médico.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <PainScale label="Dolor" value={checkIn.pain} onChange={(pain) => updateCheckIn({ pain })} />
          <Scale label="Rigidez" value={checkIn.stiffness ?? 0} onChange={(stiffness) => updateCheckIn({ stiffness })} />
          <Scale label="Fatiga" value={checkIn.fatigue ?? 0} onChange={(fatigue) => updateCheckIn({ fatigue })} />
          <Scale label="Calidad del sueño" value={checkIn.sleepQuality ?? 7} onChange={(sleepQuality) => updateCheckIn({ sleepQuality })} />
          <label className="font-semibold text-petrol-700">Horas de sueño<input className="mt-2 min-h-11 w-full rounded-xl border border-petrol-100 px-3" type="number" min="0" max="14" step="0.5" value={checkIn.sleepHours ?? 7} onChange={(event) => updateCheckIn({ sleepHours: Number(event.target.value) })} /></label>
          <label className="font-semibold text-petrol-700">Estado de ánimo<select className="mt-2 min-h-11 w-full rounded-xl border border-petrol-100 px-3" value={checkIn.mood || 'Tranquilo'} onChange={(event) => updateCheckIn({ mood: event.target.value, feeling: event.target.value })}>{moods.map((mood) => <option key={mood}>{mood}</option>)}</select></label>
        </div>
        {checkIn.pain >= 7 && <div className="mt-4 rounded-xl bg-amber-50 p-3 font-semibold text-amber-900">Hoy no deberías realizar la rutina sin consultar previamente con un profesional sanitario.</div>}
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Timeline de hoy</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <TimelineItem title="Chequeo" body="Dolor, sueño y fatiga registrados antes de empezar." active />
          <TimelineItem title="Rutina" body={`${recommendedRoutine.exercises.length} ejercicios con control y descanso.`} />
          <TimelineItem title="Registro" body="Guarda síntomas, observaciones y progreso al terminar." />
        </div>
      </Card>

      <LocalAssistant state={state} />

      <Card className="bg-gradient-to-br from-white to-petrol-50">
        <p className="text-sm font-bold uppercase text-aqua">Recordatorio</p>
        <p className="mt-2 text-xl font-semibold leading-relaxed text-petrol-700">{quote}</p>
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

function TimelineItem({ title, body, active = false }: { title: string; body: string; active?: boolean }) {
  return (
    <div className="relative rounded-[24px] border border-petrol-100 bg-white/58 p-4">
      <div className={`premium-timeline-dot grid size-10 place-items-center rounded-full ${active ? 'bg-petrol-500 text-white' : 'bg-petrol-50 text-petrol-700'}`}>
        <CheckCircle2 className="size-5" />
      </div>
      <p className="mt-4 font-bold text-petrol-700">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function LocalAssistant({ state }: { state: AppState }) {
  const [query, setQuery] = useState('');
  const answer = getLocalAssistantAnswer(query, state);
  return (
    <Card>
      <h3 className="flex items-center gap-2 text-xl font-bold text-petrol-700"><MessageCircle className="size-5" /> Asistente local</h3>
      <p className="mt-1 text-sm text-slate-600">Responde sobre uso de la app, ejercicios, rutinas, historial y progreso. No realiza diagnósticos.</p>
      <label className="mt-3 flex items-center gap-3 rounded-xl border border-petrol-100 bg-white px-4">
        <Search className="size-5 shrink-0 text-slate-500" />
        <input className="min-h-12 flex-1 border-0 bg-transparent pl-1 outline-none" placeholder="Buscar ejercicio, rutina o duda de uso" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      {query && <div className="mt-3 rounded-xl bg-petrol-50 p-4 text-sm leading-relaxed text-slate-700">{answer}</div>}
    </Card>
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

function calculateCurrentStreak(sessions: AppState['sessions']) {
  const dates = new Set(sessions.filter((session) => session.completedExerciseIds.length).map((session) => session.date));
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    if (dates.has(day.toISOString().slice(0, 10))) streak += 1;
    else if (i > 0) break;
  }
  return streak;
}

function getLocalAssistantAnswer(query: string, state: AppState) {
  const normalized = query.toLowerCase();
  const exercise = state.exercises.find((item) => normalized && item.name.toLowerCase().includes(normalized));
  if (exercise) return `${exercise.name}: ${exercise.description} Posición: ${exercise.position} Respiración: ${exercise.breathing}`;
  if (normalized.includes('dolor')) return 'El dolor se registra antes y después de cada sesión para observar tolerancia. Si aparece dolor intenso o síntomas nuevos, detén la sesión y consulta con un profesional.';
  if (normalized.includes('rutina')) return `Tienes ${state.routines.length} rutinas. La rutina recomendada hoy se elige por día asignado y puede cambiarse desde la pantalla Rutina.`;
  if (normalized.includes('progreso') || normalized.includes('historial')) return `Hay ${state.sessions.length} sesiones registradas con dolor, fatiga, ejercicios y observaciones. Consulta Progreso o Historial médico para el detalle.`;
  if (normalized.includes('material') || normalized.includes('banco') || normalized.includes('pesas')) return 'El material disponible se configura en Ajustes. La biblioteca filtra banco, mancuernas y bandas según esa configuración.';
  return 'Puedo ayudarte a encontrar ejercicios, explicar rutinas, interpretar el historial de la app y localizar opciones. No sustituyo a un profesional sanitario ni doy diagnósticos.';
}
