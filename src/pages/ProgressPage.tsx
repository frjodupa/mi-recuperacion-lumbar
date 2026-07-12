import { Award, CalendarDays, CheckCircle2, Clock3, Download, HeartPulse, Printer } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button, Card } from '../components/ui';
import type { AppState, ExerciseSessionLog, Session } from '../types';

export function ProgressPage({ state }: { state: AppState }) {
  const [weeklyFilter, setWeeklyFilter] = useState<'all' | 'sessions' | 'rest'>('all');
  const completed = state.sessions.filter((session) => session.completedExerciseIds.length > 0);
  const minutes = state.sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const exercises = state.sessions.reduce((sum, session) => sum + session.completedExerciseIds.length, 0);
  const avgBefore = average(state.sessions.map((session) => session.painBefore));
  const avgAfter = average(state.sessions.map((session) => session.painAfter));
  const avgFatigue = average(state.sessions.map((session) => session.fatigue));
  const currentStreak = calculateCurrentStreak(state.sessions);
  const bestStreak = calculateBestStreak(state.sessions);
  const adherence = weeklyAdherence(state.sessions);
  const painDelta = avgBefore - avgAfter;
  const medals = getMedals(completed.length, currentStreak, minutes, adherence);
  const strengthLogs = state.sessions.flatMap((session) => session.strengthLogs?.map((log) => ({ ...log, date: session.date })) || []);
  const completionRate = Math.round(average(state.sessions.map((session) => session.completedExerciseIds.length ? 100 : 0)));
  const favorites = getFavoriteExercises(state);
  const history = state.sessions.slice().sort((a, b) => (b.savedAt || b.date).localeCompare(a.savedAt || a.date));
  const last7 = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const iso = day.toISOString().slice(0, 10);
    return { iso, session: state.sessions.find((item) => item.date === iso) };
  });
  const weeklyData = last7.map(({ iso, session }) => ({
    day: new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(new Date(iso)),
    sesiones: session?.completedExerciseIds.length ? 1 : 0,
    minutos: session?.durationMinutes || 0,
    dolor: session?.painAfter || 0,
    fatiga: session?.fatigue || 0,
  }));
  const filteredLast7 = last7.filter(({ session }) => {
    const hasSession = Boolean(session?.completedExerciseIds.length);
    if (weeklyFilter === 'sessions') return hasSession;
    if (weeklyFilter === 'rest') return !hasSession;
    return true;
  });
  const monthlyData = Array.from({ length: 30 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (29 - index));
    const iso = day.toISOString().slice(0, 10);
    const session = state.sessions.find((item) => item.date === iso);
    return { day: day.getDate().toString(), minutos: session?.durationMinutes || 0, dolor: session?.painAfter || 0 };
  });

  return (
    <div className="space-y-5">
      <div className="premium-hero rounded-[32px] border border-white/70 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">Dashboard clínico</p>
          <h2 className="mt-2 text-4xl font-bold leading-tight tracking-[-0.04em] text-petrol-700">Progreso e historial</h2>
          <p className="mt-2 max-w-2xl text-slate-600">Seguimiento clínico de sesiones, síntomas, fuerza, tolerancia y adherencia.</p>
        </div>
        <div className="no-print flex gap-2"><Button variant="secondary" onClick={() => window.print()}><Printer className="size-5" /> Exportar resumen</Button><Button variant="ghost" onClick={() => window.print()}><Download className="size-5" /> Imprimir PDF</Button></div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Stat label="Sesiones completadas" value={completed.length} />
        <Stat label="Ejercicios registrados" value={exercises} />
        <Stat label="Minutos acumulados" value={minutes} />
        <Stat label="Racha actual" value={`${currentStreak} d`} />
        <Stat label="Mejor racha" value={`${bestStreak} d`} />
        <Stat label="Adherencia 7 días" value={`${adherence}%`} />
        <Stat label="% completado" value={`${completionRate}%`} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Dolor medio antes" value={avgBefore.toFixed(1)} />
        <Stat label="Dolor medio después" value={avgAfter.toFixed(1)} />
        <Stat label="Mejora media dolor" value={painDelta >= 0 ? `-${painDelta.toFixed(1)}` : `+${Math.abs(painDelta).toFixed(1)}`} />
        <Stat label="Fatiga media" value={avgFatigue.toFixed(1)} />
      </div>

      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Medallas de constancia</h3>
        <p className="mt-1 text-sm text-slate-600">Reconocimientos sobrios basados en adherencia y registro, sin objetivos competitivos.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {medals.map((medal) => (
            <div key={medal.title} className={`rounded-xl border p-4 ${medal.earned ? 'border-calmgreen bg-green-50' : 'border-petrol-100 bg-petrol-50 opacity-75'}`}>
              <Award className="size-6 text-calmgreen" />
              <p className="mt-2 font-bold text-petrol-700">{medal.title}</p>
              <p className="text-sm text-slate-600">{medal.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Últimos 7 días</p>
            <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-petrol-700">Vista semanal</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Resumen limpio de actividad, descanso y tolerancia durante la semana reciente.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-slate-600">{last7.filter(({ session }) => session?.completedExerciseIds.length).length} sesiones esta semana</p>
            <div className="flex rounded-2xl border border-petrol-100 bg-white/60 p-1 shadow-sm">
              {[
                ['all', 'Todos'],
                ['sessions', 'Sesiones'],
                ['rest', 'Descanso'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-10 rounded-xl px-4 text-sm font-bold transition ${weeklyFilter === value ? 'bg-petrol-500 text-white shadow-sm' : 'text-slate-600 hover:bg-petrol-50 hover:text-petrol-700'}`}
                  onClick={() => setWeeklyFilter(value as 'all' | 'sessions' | 'rest')}
                  aria-pressed={weeklyFilter === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredLast7.map(({ iso, session }) => <WeeklySessionCard key={iso} iso={iso} session={session} />)}
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Registro mensual</p>
            <h3 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-[-0.03em] text-petrol-700"><CalendarDays className="size-6" /> Calendario de sesiones</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600">
            <span className="rounded-full border border-petrol-100 bg-green-50 px-3 py-1 text-calmgreen">Sesión</span>
            <span className="rounded-full border border-petrol-100 bg-white/60 px-3 py-1">Descanso</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 rounded-[28px] border border-petrol-100 bg-white/48 p-2 sm:gap-3 sm:p-3">
          {['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map((day) => (
            <div key={day} className="px-1 pb-1 text-center text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">{day}</div>
          ))}
          {Array.from({ length: 35 }, (_, index) => {
            const day = new Date();
            day.setDate(day.getDate() - (34 - index));
            const iso = day.toISOString().slice(0, 10);
            const session = state.sessions.find((item) => item.date === iso);
            return <CalendarSessionDay key={iso} day={day} session={session} />;
          })}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <RechartsPanel title="Gráfico semanal" description="Minutos y tolerancia de los últimos 7 días">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyData} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="minutesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2bbdc1" stopOpacity={0.34} />
                  <stop offset="95%" stopColor="#2bbdc1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e9ea" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="minutos" stroke="#0f5c63" strokeWidth={3} fill="url(#minutesGradient)" />
              <Area type="monotone" dataKey="dolor" stroke="#2f8f69" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </RechartsPanel>
        <RechartsPanel title="Gráfico mensual" description="Tiempo acumulado por día">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e9ea" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="minutos" fill="#2bbdc1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </RechartsPanel>
      </div>

      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Evolución de fuerza y material</h3>
        {strengthLogs.length ? (
          <div className="mt-3 space-y-2">
            {strengthLogs.slice(-8).reverse().map((log, index) => (
              <div key={`${log.exerciseId}-${log.date}-${index}`} className="rounded-xl border border-petrol-100 p-3">
                <p className="font-bold text-petrol-700">{log.exerciseName}</p>
                <p className="text-sm text-slate-600">{formatDate(log.date)} · {log.weightKg} kg {log.weightMode === 'per-hand' ? 'por mano' : 'totales'} · {log.setsCompleted} series · {log.repetitions || 'repeticiones según pauta'}</p>
                <p className="text-xs font-semibold text-calmgreen">Progresión registrada manualmente por usuario/profesional.</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 rounded-xl bg-petrol-50 p-4 text-sm text-slate-700">Aún no hay cargas registradas. La aplicación no propone subir peso automáticamente; el peso solo se registra si lo introduce el usuario o un profesional.</p>
        )}
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Ejercicios favoritos por uso</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {favorites.map((item) => <div key={item.id} className="rounded-xl border border-petrol-100 p-3"><p className="font-bold text-petrol-700">{item.name}</p><p className="text-sm text-slate-600">{item.count} registros</p></div>)}
          {!favorites.length && <p className="text-sm text-slate-600">Aún no hay suficientes sesiones para calcular favoritos.</p>}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-petrol-700">Historial detallado</h3>
        <div className="mt-3 space-y-3">
          {history.map((session) => <SessionHistory key={session.id} session={session} state={state} />)}
        </div>
      </Card>
    </div>
  );
}

function WeeklySessionCard({ iso, session }: { iso: string; session?: Session }) {
  const completedSession = Boolean(session?.completedExerciseIds.length);
  return (
    <div className={`min-h-[220px] rounded-[28px] border p-5 transition ${completedSession ? 'border-calmgreen/40 bg-green-50 shadow-soft' : 'border-petrol-100 bg-white/58'}`}>
      <div className="flex h-full min-w-0 flex-col gap-5">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${completedSession ? 'bg-calmgreen text-white' : 'bg-white/70 text-slate-500'}`}>
              {completedSession ? <CheckCircle2 className="size-5" /> : <Clock3 className="size-5" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xl font-bold capitalize leading-tight text-petrol-700">{new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date(iso))}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{formatDate(iso)}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${completedSession ? 'bg-calmgreen/10 text-calmgreen' : 'bg-white/70 text-slate-600'}`}>
            {completedSession ? 'Sesión' : 'Descanso'}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-2xl font-bold leading-tight text-petrol-700">{completedSession ? 'Sesión completada' : 'Día de descanso'}</p>
          {session?.completedExerciseIds.includes('caminata-suave') && (
            <p className="mt-2 inline-flex max-w-full rounded-full bg-calmgreen/10 px-3 py-1 text-xs font-bold leading-snug text-calmgreen">
              Ejercicio incluido: caminata suave
            </p>
          )}
        </div>

        <div className="mt-auto grid min-w-0 gap-2 text-sm text-slate-600 sm:grid-cols-3">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-2xl border border-petrol-100 bg-white/60 px-3 py-2"><Clock3 className="size-4 shrink-0 text-aqua" /> <span className="truncate">{session?.durationMinutes || 0} min</span></span>
          <span className="inline-flex min-w-0 items-center gap-2 rounded-2xl border border-petrol-100 bg-white/60 px-3 py-2"><HeartPulse className="size-4 shrink-0 text-aqua" /> <span className="truncate">Dolor {session?.painBefore ?? '-'}→{session?.painAfter ?? '-'}</span></span>
          <span className="min-w-0 truncate rounded-2xl border border-petrol-100 bg-white/60 px-3 py-2">Fatiga {session?.fatigue ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}

function CalendarSessionDay({ day, session }: { day: Date; session?: Session }) {
  const completedSession = Boolean(session?.completedExerciseIds.length);
  const today = new Date().toISOString().slice(0, 10) === day.toISOString().slice(0, 10);
  return (
    <div className={`flex min-h-[92px] flex-col justify-between rounded-[22px] border p-3 transition sm:min-h-[116px] ${completedSession ? 'border-calmgreen/40 bg-green-50 text-calmgreen shadow-sm' : 'border-petrol-100 bg-white/58 text-slate-600'} ${today ? 'ring-2 ring-aqua/60 ring-offset-2 ring-offset-transparent' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-petrol-700">{day.getDate()}</span>
        {completedSession && <CheckCircle2 className="size-4 shrink-0 text-calmgreen" />}
      </div>
      <div className="mt-3 space-y-1">
        <p className="truncate text-[0.72rem] font-bold">{completedSession ? `${session?.durationMinutes || 0} min` : 'Descanso'}</p>
        {completedSession && <p className="truncate text-[0.68rem] font-semibold text-slate-600">Dolor {session?.painBefore ?? '-'}→{session?.painAfter ?? '-'}</p>}
      </div>
    </div>
  );
}

function SessionHistory({ session, state }: { session: Session; state: AppState }) {
  const routine = state.routines.find((item) => item.id === session.routineId);
  const logs: ExerciseSessionLog[] = session.exerciseLogs || session.completedExerciseIds.map((id) => {
    const exercise = state.exercises.find((item) => item.id === id);
    return exercise ? { exerciseId: id, exerciseName: exercise.name, category: exercise.category, setsCompleted: exercise.sets || 1, setsPlanned: exercise.sets || 1, workSeconds: exercise.workSeconds || 0, restSeconds: exercise.restSeconds || 0, completed: true } : null;
  }).filter((log): log is ExerciseSessionLog => Boolean(log));
  return (
    <details className="rounded-xl border border-petrol-100 bg-white p-4">
      <summary className="cursor-pointer font-bold text-petrol-700">{formatDate(session.date)} · {routine?.name || 'Rutina'} · {session.durationMinutes} min · dolor {session.painBefore}→{session.painAfter}</summary>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_260px]">
        <div>
          <p className="text-sm text-slate-600">Fatiga {session.fatigue}/10 · {session.walked ? 'caminata completada' : 'sin caminata registrada'}</p>
          <p className="mt-2 text-sm text-slate-700">{session.observations || 'Sin observaciones.'}</p>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            {logs.map((log) => <li key={log.exerciseId}>• {log.exerciseName} · {log.setsCompleted}/{log.setsPlanned} series</li>)}
          </ul>
        </div>
        <div className="rounded-xl bg-petrol-50 p-3 text-sm text-slate-700">
          <p className="font-bold text-petrol-700">Registro de sesión</p>
          <p>{session.completedExerciseIds.length} ejercicios completados</p>
          <p>{session.strengthLogs?.length || 0} registros de fuerza</p>
          <p>Guardado: {session.savedAt ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(session.savedAt)) : 'registro antiguo'}</p>
        </div>
      </div>
    </details>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <Card className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-petrol-700">{value}</p></Card>;
}

function RechartsPanel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <Card className="p-6"><h3 className="text-xl font-bold tracking-[-0.02em] text-petrol-700">{title}</h3><p className="mb-5 text-sm text-slate-600">{description}</p>{children}</Card>;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
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

function calculateBestStreak(sessions: AppState['sessions']) {
  const dates = Array.from(new Set(sessions.filter((session) => session.completedExerciseIds.length).map((session) => session.date))).sort();
  let best = 0;
  let current = 0;
  let previous = '';
  dates.forEach((date) => {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    current = previous === yesterday.toISOString().slice(0, 10) ? current + 1 : 1;
    best = Math.max(best, current);
    previous = date;
  });
  return best;
}

function weeklyAdherence(sessions: AppState['sessions']) {
  const dates = new Set(sessions.filter((session) => session.completedExerciseIds.length).map((session) => session.date));
  let complete = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    if (dates.has(day.toISOString().slice(0, 10))) complete += 1;
  }
  return Math.round((complete / 7) * 100);
}

function getMedals(completedSessions: number, streak: number, minutes: number, adherence: number) {
  return [
    { title: 'Registro consistente', body: '5 sesiones completadas.', earned: completedSessions >= 5 },
    { title: 'Semana cuidada', body: '3 días seguidos con sesión registrada.', earned: streak >= 3 },
    { title: 'Tiempo acumulado', body: '120 minutos de trabajo controlado.', earned: minutes >= 120 },
    { title: 'Adherencia alta', body: '70% o más en los últimos 7 días.', earned: adherence >= 70 },
  ];
}

function getFavoriteExercises(state: AppState) {
  const counts = new Map<string, number>();
  state.sessions.flatMap((session) => session.completedExerciseIds).forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, count]) => ({ id, count, name: state.exercises.find((exercise) => exercise.id === id)?.name || id }));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(date));
}
