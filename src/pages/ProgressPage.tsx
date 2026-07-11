import { Award, Download, Printer } from 'lucide-react';
import { Button, Card } from '../components/ui';
import type { AppState, ExerciseSessionLog, Session } from '../types';

export function ProgressPage({ state }: { state: AppState }) {
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-petrol-700">Progreso e historial</h2>
          <p className="text-slate-600">Seguimiento clínico de sesiones, síntomas, fuerza, tolerancia y adherencia.</p>
        </div>
        <div className="no-print flex gap-2"><Button variant="secondary" onClick={() => window.print()}><Printer className="size-5" /> Exportar resumen</Button><Button variant="ghost" onClick={() => window.print()}><Download className="size-5" /> Imprimir PDF</Button></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
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

      <Card>
        <h3 className="mb-3 text-xl font-bold text-petrol-700">Vista semanal</h3>
        <div className="grid gap-2 md:grid-cols-7">
          {last7.map(({ iso, session }) => (
            <div key={iso} className="rounded-xl border border-petrol-100 p-3">
              <p className="font-bold text-petrol-700">{new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(new Date(iso))}</p>
              <p className="text-sm text-slate-600">{session?.completedExerciseIds.length ? 'Sesión completada' : 'Descanso'}</p>
              <p className="text-xs text-slate-500">{session?.durationMinutes || 0} min · dolor {session?.painBefore ?? '-'}→{session?.painAfter ?? '-'}</p>
              <p className="text-xs text-slate-500">Fatiga {session?.fatigue ?? '-'}</p>
              {session?.completedExerciseIds.includes('caminata-suave') && <p className="text-xs font-semibold text-calmgreen">Caminata suave completada</p>}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-xl font-bold text-petrol-700">Calendario de sesiones</h3>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, index) => {
            const day = new Date();
            day.setDate(day.getDate() - (34 - index));
            const iso = day.toISOString().slice(0, 10);
            const session = state.sessions.find((item) => item.date === iso);
            return <div key={iso} className={`grid aspect-square place-items-center rounded-lg text-xs font-bold ${session?.completedExerciseIds.length ? 'bg-green-100 text-calmgreen' : 'bg-petrol-50 text-slate-500'}`}>{day.getDate()}</div>;
          })}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Chart title="Sesiones completadas" values={last7.map((item) => item.session?.completedExerciseIds.length ? 1 : 0)} />
        <Chart title="Minutos de actividad" values={last7.map((item) => item.session?.durationMinutes || 0)} />
        <Chart title="Dolor después" values={last7.map((item) => item.session?.painAfter || 0)} />
        <Chart title="Fatiga" values={last7.map((item) => item.session?.fatigue || 0)} />
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
  return <Card><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-petrol-700">{value}</p></Card>;
}

function Chart({ title, values }: { title: string; values: number[] }) {
  const max = Math.max(1, ...values);
  return <Card><h3 className="mb-4 font-bold text-petrol-700">{title}</h3><div className="flex h-40 items-end gap-2">{values.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-aqua" style={{ height: `${Math.max(8, (value / max) * 140)}px` }} /><span className="text-xs text-slate-500">{index + 1}</span></div>)}</div></Card>;
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
