import { CalendarDays, MessageCircle, Play, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AppState, DailyCheckIn } from '../types';
import { Button, Card, PainScale, ProgressRing, SafetyNotice } from '../components/ui';
import type { PageId } from '../components/BottomNavigation';

const moods = ['Tranquilo', 'Animado', 'Cansado', 'Preocupado', 'Irritable'];
const quotes = ['La recuperación no consiste en correr, sino en avanzar con seguridad.', 'Cada movimiento controlado cuenta.', 'La constancia vale más que la intensidad.', 'Escucha tu cuerpo y respeta tu proceso.'];

export function Home({ state, setState, setPage }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; setPage: (page: PageId) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const recommendedRoutine = useMemo(() => getRecommendedRoutine(state), [state]);
  const session = state.sessions.find((item) => item.date === today);
  const checkIn = state.checkIns.find((item) => item.date === today) || createDefaultCheckIn(today, recommendedRoutine.id);
  const percent = Math.round(((session?.completedExerciseIds.length || 0) / Math.max(1, recommendedRoutine.exercises.length)) * 100);
  const totalMinutes = state.sessions.reduce((sum, item) => sum + item.durationMinutes, 0);
  const surgeryDays = getDaysSince(state.preferences.surgeryDate);
  const quote = quotes[new Date().getDay() % quotes.length];

  const updateCheckIn = (patch: Partial<DailyCheckIn>) => {
    setState((current) => ({ ...current, checkIns: [...current.checkIns.filter((item) => item.date !== today), { ...checkIn, ...patch, recommendedRoutineId: recommendedRoutine.id }] }));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold text-petrol-700">Buenos días, {state.preferences.patientName || 'José'}.</h2>
        <p className="text-lg text-slate-600">{new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</p>
      </div>
      <SafetyNotice />

      <Card>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-semibold text-petrol-700"><CalendarDays className="size-5" /> Asistente diario</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Días desde operación" value={surgeryDays === null ? 'Configurar' : surgeryDays} />
              <Metric label="Tiempo rehabilitación" value={`${totalMinutes} min`} />
              <Metric label="Sesión recomendada" value={recommendedRoutine.name} />
            </div>
            <Button className="w-full sm:w-auto" onClick={() => setPage('routine')}><Play className="size-5" /> Comenzar sesión recomendada</Button>
          </div>
          <ProgressRing percent={percent} />
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Antes de comenzar</h3>
        <p className="mt-1 text-sm text-slate-600">Estos datos ayudan a contextualizar la sesión y el historial médico.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <PainScale label="Dolor" value={checkIn.pain} onChange={(pain) => updateCheckIn({ pain })} />
          <Scale label="Rigidez" value={checkIn.stiffness ?? 0} onChange={(stiffness) => updateCheckIn({ stiffness })} />
          <Scale label="Fatiga" value={checkIn.fatigue ?? 0} onChange={(fatigue) => updateCheckIn({ fatigue })} />
          <Scale label="Calidad del sueño" value={checkIn.sleepQuality ?? 7} onChange={(sleepQuality) => updateCheckIn({ sleepQuality })} />
          <label className="font-semibold text-petrol-700">Horas de sueño<input className="mt-2 min-h-11 w-full rounded-xl border border-petrol-100 px-3" type="number" min="0" max="14" step="0.5" value={checkIn.sleepHours ?? 7} onChange={(event) => updateCheckIn({ sleepHours: Number(event.target.value) })} /></label>
          <label className="font-semibold text-petrol-700">Estado de ánimo<select className="mt-2 min-h-11 w-full rounded-xl border border-petrol-100 px-3" value={checkIn.mood || 'Tranquilo'} onChange={(event) => updateCheckIn({ mood: event.target.value, feeling: event.target.value })}>{moods.map((mood) => <option key={mood}>{mood}</option>)}</select></label>
        </div>
        {checkIn.pain >= 7 && <div className="mt-4 rounded-xl bg-amber-50 p-3 font-semibold text-amber-900">Hoy no deberías realizar la rutina sin consultar previamente con un profesional sanitario.</div>}
      </Card>

      <LocalAssistant state={state} />

      <Card className="bg-gradient-to-br from-white to-petrol-50">
        <p className="text-sm font-bold uppercase text-aqua">Recordatorio</p>
        <p className="mt-2 text-xl font-semibold leading-relaxed text-petrol-700">{quote}</p>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-petrol-100 bg-petrol-50 p-3"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 font-bold text-petrol-700">{value}</p></div>;
}

function Scale({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block font-semibold text-petrol-700">{label} <span className="rounded-full bg-petrol-50 px-2 py-1 text-sm">{value}/10</span>
      <input className="mt-2 h-3 w-full accent-petrol-500" type="range" min="0" max="10" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function LocalAssistant({ state }: { state: AppState }) {
  const [query, setQuery] = useState('');
  const answer = getLocalAssistantAnswer(query, state);
  return (
    <Card>
      <h3 className="flex items-center gap-2 text-xl font-bold text-petrol-700"><MessageCircle className="size-5" /> Asistente local</h3>
      <p className="mt-1 text-sm text-slate-600">Responde sobre uso de la app, ejercicios, rutinas, historial y progreso. No realiza diagnósticos.</p>
      <label className="mt-3 flex items-center gap-2 rounded-xl border border-petrol-100 bg-white px-3">
        <Search className="size-5 text-slate-500" />
        <input className="min-h-12 flex-1 border-0 bg-transparent outline-none" placeholder="Buscar ejercicio, rutina o duda de uso" value={query} onChange={(event) => setQuery(event.target.value)} />
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

function getLocalAssistantAnswer(query: string, state: AppState) {
  const normalized = query.toLowerCase();
  const exercise = state.exercises.find((item) => normalized && item.name.toLowerCase().includes(normalized));
  if (exercise) return `${exercise.name}: ${exercise.description} Posición: ${exercise.position} Respiración: ${exercise.breathing}`;
  if (normalized.includes('dolor')) return 'El dolor se registra antes y después de cada sesión para observar tolerancia. Si aparece dolor intenso o síntomas nuevos, detén la sesión y consulta con un profesional.';
  if (normalized.includes('rutina')) return `Tienes ${state.routines.length} rutinas. La rutina recomendada hoy se elige por día asignado y puede cambiarse desde la pantalla Rutina.`;
  if (normalized.includes('progreso') || normalized.includes('historial')) return `Hay ${state.sessions.length} sesiones registradas con dolor, fatiga, ejercicios y observaciones. Consulta Progreso o Historial médico para el detalle.`;
  if (normalized.includes('material') || normalized.includes('banco') || normalized.includes('pesas')) return 'El material disponible se configura en Información. La biblioteca filtra banco, mancuernas y bandas según esa configuración.';
  return 'Puedo ayudarte a encontrar ejercicios, explicar rutinas, interpretar el historial de la app y localizar opciones. No sustituyo a un profesional sanitario ni doy diagnósticos.';
}
