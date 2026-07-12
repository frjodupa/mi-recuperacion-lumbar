import { Activity, CalendarDays, Clock3, ClipboardList, FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button, Card } from '../components/ui';
import type { AppState, Session } from '../types';

export function MedicalHistoryPage({ state }: { state: AppState }) {
  const [query, setQuery] = useState('');
  const history = state.sessions.slice().sort((a, b) => (b.savedAt || b.date).localeCompare(a.savedAt || a.date));
  const filteredHistory = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return history;
    return history.filter((session) => {
      const routine = state.routines.find((item) => item.id === session.routineId);
      const exerciseNames = getExerciseNames(session, state);
      const haystack = [
        session.date,
        formatDate(session.date),
        getWeekday(session.date),
        getSessionTime(session),
        routine?.name,
        session.durationMinutes,
        session.painBefore,
        session.painAfter,
        session.fatigue,
        session.stiffness,
        session.observations,
        session.incidents,
        exerciseNames.join(' '),
      ].join(' ');
      return normalizeText(haystack).includes(normalizedQuery);
    });
  }, [history, query, state]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-petrol-700">Historial médico</h2>
          <p className="text-slate-600">Registro clínico detallado de síntomas, ejercicios, cargas, incidencias y observaciones.</p>
        </div>
        <Button variant="secondary" onClick={() => window.print()}><FileText className="size-5" /> PDF profesional</Button>
      </div>
      <Card>
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="Sesiones" value={history.length} />
          <Metric label="Dolor medio" value={average(history.map((item) => item.painAfter)).toFixed(1)} />
          <Metric label="Fatiga media" value={average(history.map((item) => item.fatigue)).toFixed(1)} />
          <Metric label="Duración total" value={`${history.reduce((sum, item) => sum + item.durationMinutes, 0)} min`} />
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Buscar en historial</p>
            <p className="mt-1 text-sm text-slate-600">Filtra por día, fecha, rutina, ejercicio, dolor u observaciones.</p>
          </div>
          <label className="relative block w-full lg:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              className="min-h-12 w-full rounded-2xl border border-petrol-100 bg-white px-4 py-3 pl-12 text-slate-800 shadow-sm"
              placeholder="Ej. 11 jul, viernes, caminata, dolor 3"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
          <span className="rounded-full border border-petrol-100 bg-white/60 px-3 py-1">{filteredHistory.length} de {history.length} sesiones</span>
          {query && <button className="min-h-0 rounded-full border border-petrol-100 bg-petrol-50 px-3 py-1 text-petrol-700" type="button" onClick={() => setQuery('')}>Limpiar búsqueda</button>}
        </div>
      </Card>

      <div className="space-y-3">
        {filteredHistory.map((session) => <HistoryEntry key={session.id} session={session} state={state} />)}
        {!history.length && <Card><p className="text-slate-600">Aún no hay sesiones registradas.</p></Card>}
        {Boolean(history.length) && !filteredHistory.length && <Card><p className="text-slate-600">No hay sesiones que coincidan con la búsqueda.</p></Card>}
      </div>
    </div>
  );
}

function HistoryEntry({ session, state }: { session: Session; state: AppState }) {
  const routine = state.routines.find((item) => item.id === session.routineId);
  const time = getSessionTime(session);
  const weight = session.strengthLogs?.map((item) => `${item.exerciseName}: ${item.weightKg} kg`).join(' · ') || 'Sin peso registrado';
  const exerciseNames = getExerciseNames(session, state);
  const hasTime = Boolean(session.savedAt);
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
              <span className="inline-flex items-center gap-2 rounded-full bg-calmgreen/10 px-3 py-1 text-calmgreen"><CalendarDays className="size-4" /> {formatDate(session.date)}</span>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${hasTime ? 'bg-petrol-50 text-petrol-700' : 'bg-white/60 text-slate-600'}`}><Clock3 className="size-4" /> {time}</span>
            </div>
            <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-petrol-700">{routine?.name || 'Rutina'}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SessionPill icon={<Clock3 className="size-4" />} label="Duración" value={`${session.durationMinutes} min`} />
              <SessionPill icon={<Activity className="size-4" />} label="Dolor" value={`${session.painBefore}→${session.painAfter}`} />
              <SessionPill icon={<ClipboardList className="size-4" />} label="Fatiga" value={`${session.fatigue}/10`} />
            </div>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
              <p><span className="font-bold text-petrol-700">Rigidez:</span> {session.stiffness ?? '-'}/10</p>
              <p><span className="font-bold text-petrol-700">Peso utilizado:</span> {weight}</p>
              <p><span className="font-bold text-petrol-700">Observaciones:</span> {session.observations || 'Sin observaciones.'}</p>
              <p><span className="font-bold text-petrol-700">Incidencias:</span> {session.incidents || 'Sin incidencias registradas.'}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-petrol-100 bg-petrol-50 p-5 text-sm text-slate-700 lg:border-l lg:border-t-0">
          <p className="flex items-center gap-2 font-bold text-petrol-700"><ClipboardList className="size-5 text-aqua" /> Ejercicios realizados</p>
          <ul className="mt-4 space-y-2">
            {(session.exerciseLogs || []).map((log) => <li key={log.exerciseId} className="rounded-xl bg-white/60 px-3 py-2">{log.exerciseName} · {log.setsCompleted} series · {log.repetitions || log.duration || 'según pauta'}</li>)}
            {!session.exerciseLogs?.length && exerciseNames.map((name) => <li key={name} className="rounded-xl bg-white/60 px-3 py-2">{name}</li>)}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-petrol-100 bg-petrol-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-petrol-700">{value}</p></div>;
}

function SessionPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-petrol-100 bg-white/60 p-3">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{icon}{label}</p>
      <p className="mt-1 text-lg font-bold text-petrol-700">{value}</p>
    </div>
  );
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(date));
}

function getWeekday(date: string) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date(date));
}

function getSessionTime(session: Session) {
  return session.savedAt ? new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' }).format(new Date(session.savedAt)) : 'Hora no registrada';
}

function getExerciseNames(session: Session, state: AppState) {
  if (session.exerciseLogs?.length) return session.exerciseLogs.map((log) => log.exerciseName);
  return session.completedExerciseIds.map((id) => state.exercises.find((exercise) => exercise.id === id)?.name || id);
}

function normalizeText(value: unknown) {
  return String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
