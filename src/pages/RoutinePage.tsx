import { Check, ChevronDown, ChevronUp, Clock, Dumbbell, Maximize2, Pause, Play, Save, ShieldAlert, Square, TimerReset, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ExerciseDetail } from '../components/ExerciseDetail';
import { Button, Card, Modal, PainScale, ProgressRing } from '../components/ui';
import { finishTimer, setRelaxingSound, speakCue } from '../services/timer';
import type { AppState, Exercise, ExerciseSessionLog, RoutineExercise, StrengthSessionLog } from '../types';

type TimerMode = 'ready' | 'prep' | 'work' | 'rest' | 'paused' | 'done';
type SessionItem = RoutineExercise & { exercise?: Exercise };

export function RoutinePage({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [routineId, setRoutineId] = useState(state.routines[0]?.id || '');
  const routine = state.routines.find((item) => item.id === routineId) || state.routines[0];
  const items = useMemo(() => routine.exercises.slice().sort((a, b) => a.order - b.order).map((item) => ({ ...item, exercise: state.exercises.find((exercise) => exercise.id === item.exerciseId) })), [routine, state.exercises]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSet, setActiveSet] = useState(1);
  const [mode, setMode] = useState<TimerMode>('ready');
  const [pausedFrom, setPausedFrom] = useState<TimerMode>('ready');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [halfCueDone, setHalfCueDone] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, ExerciseSessionLog>>({});
  const [weightLogs, setWeightLogs] = useState<Record<string, number>>({});
  const [openedExercise, setOpenedExercise] = useState<Exercise | null>(null);
  const [finishOpen, setFinishOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [form, setForm] = useState({ painBefore: 2, painAfter: 2, fatigue: 3, observations: '', incidents: '' });

  const activeItem = items[activeIndex];
  const activeExercise = activeItem?.exercise;
  const nextExercise = items[activeIndex + 1]?.exercise;
  const totalSets = getSets(activeItem);
  const workSeconds = getWorkSeconds(activeItem);
  const restSeconds = getRestSeconds(activeItem);
  const percent = Math.round((completed.length / Math.max(1, items.length)) * 100);
  const remainingSeconds = getRemainingSeconds(items, activeIndex, activeSet, mode, secondsLeft);
  const includesWalking = routine.exercises.some((item) => item.exerciseId === 'caminata-suave');
  const walked = completed.includes('caminata-suave');
  const todayCheckIn = state.checkIns.find((item) => item.date === new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (mode !== 'prep' && mode !== 'work' && mode !== 'rest') return;
    if (mode === 'work' && !halfCueDone && secondsLeft === Math.ceil(workSeconds / 2)) {
      setHalfCueDone(true);
      speakCue('Mitad del tiempo.', state.preferences.voiceGuidanceEnabled);
      if (state.preferences.soundEnabled) finishTimer(true, false);
    }
    if (secondsLeft <= 0) {
      finishTimer(state.preferences.soundEnabled, state.preferences.vibrationEnabled);
      advanceTimer();
      return;
    }
    const timeout = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [halfCueDone, mode, secondsLeft, state.preferences.soundEnabled, state.preferences.vibrationEnabled, state.preferences.voiceGuidanceEnabled, workSeconds]);

  useEffect(() => {
    setRelaxingSound(state.preferences.relaxingSoundEnabled && (mode === 'work' || mode === 'rest'));
    return () => setRelaxingSound(false);
  }, [mode, state.preferences.relaxingSoundEnabled]);

  useEffect(() => {
    if (!activeExercise || (mode !== 'prep' && mode !== 'work' && mode !== 'rest')) return;
    if (mode === 'prep') speakCue(`Prepárate para ${activeExercise.name}.`, state.preferences.voiceGuidanceEnabled);
    if (mode === 'work') speakCue(`Empieza ${activeExercise.name}. Serie ${activeSet} de ${totalSets}.`, state.preferences.voiceGuidanceEnabled);
    if (mode === 'rest') speakCue('Descanso. Respira con calma.', state.preferences.voiceGuidanceEnabled);
  }, [activeExercise?.id, activeSet, mode, state.preferences.voiceGuidanceEnabled, totalSets]);

  useEffect(() => {
    setActiveIndex(0);
    setActiveSet(1);
    setMode('ready');
    setSecondsLeft(0);
    setCompleted([]);
    setExerciseLogs({});
  }, [routineId]);

  const start = () => {
    if (!activeExercise) return;
    setHalfCueDone(false);
    setMode('prep');
    setSecondsLeft(3);
  };

  const stopSession = () => {
    setRelaxingSound(false);
    setMode('done');
    setSecondsLeft(0);
    setFinishOpen(true);
    if (state.preferences.vibrationEnabled && 'vibrate' in navigator) navigator.vibrate([240, 80, 240]);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
      return;
    }
    await document.exitFullscreen?.();
  };

  const pause = () => {
    setPausedFrom(mode);
    setMode('paused');
  };
  const resume = () => setMode(secondsLeft > 0 ? pausedFrom : 'ready');

  const advanceTimer = () => {
    if (!activeItem?.exercise) return;
    if (mode === 'prep') {
      setHalfCueDone(false);
      setMode('work');
      setSecondsLeft(workSeconds);
      return;
    }
    if (mode === 'work' && restSeconds > 0) {
      setMode('rest');
      setSecondsLeft(restSeconds);
      speakCue('Descanso.', state.preferences.voiceGuidanceEnabled);
      return;
    }
    if (activeSet < totalSets) {
      setActiveSet((current) => current + 1);
      setHalfCueDone(false);
      setMode('prep');
      setSecondsLeft(3);
      return;
    }
    completeExercise(activeItem);
    const nextIndex = Math.min(items.length - 1, activeIndex + 1);
    if (activeIndex + 1 >= items.length) {
      setMode('done');
      setSecondsLeft(0);
      setFinishOpen(true);
      return;
    }
    setActiveIndex(nextIndex);
    setActiveSet(1);
    setHalfCueDone(false);
    setMode('prep');
    setSecondsLeft(3);
    speakCue(`Siguiente ejercicio: ${items[nextIndex].exercise?.name || 'continúa'}.`, state.preferences.voiceGuidanceEnabled);
  };

  const completeExercise = (item: SessionItem) => {
    if (!item.exercise) return;
    const exercise = item.exercise;
    const sets = getSets(item);
    setCompleted((current) => current.includes(item.exerciseId) ? current : [...current, item.exerciseId]);
    setExerciseLogs((current) => ({
      ...current,
      [item.exerciseId]: {
        exerciseId: item.exerciseId,
        exerciseName: exercise.name,
        category: exercise.category,
        setsPlanned: sets,
        setsCompleted: sets,
        workSeconds: getWorkSeconds(item),
        restSeconds: getRestSeconds(item),
        repetitions: item.repetitions || exercise.repetitions,
        duration: item.duration || exercise.duration,
        completed: true,
        notes: item.notes,
      },
    }));
  };

  const toggleComplete = (item: SessionItem) => {
    if (!item.exercise) return;
    if (completed.includes(item.exerciseId)) {
      setCompleted((current) => current.filter((id) => id !== item.exerciseId));
      setExerciseLogs((current) => {
        const next = { ...current };
        delete next[item.exerciseId];
        return next;
      });
      return;
    }
    completeExercise(item);
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = routine.exercises.slice().sort((a, b) => a.order - b.order);
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setState((current) => ({ ...current, routines: current.routines.map((item) => item.id === routine.id ? { ...item, exercises: next.map((exercise, order) => ({ ...exercise, order: order + 1 })) } : item) }));
  };

  const saveSession = () => {
    const now = new Date();
    const logs = items.map((item) => item.exercise && exerciseLogs[item.exerciseId] ? exerciseLogs[item.exerciseId] : null).filter(Boolean) as ExerciseSessionLog[];
    const strengthLogs = logs
      .filter((log) => {
        const exercise = state.exercises.find((item) => item.id === log.exerciseId);
        return exercise?.weightMode && exercise.weightMode !== 'none' && (weightLogs[log.exerciseId] || 0) > 0;
      })
      .map((log): StrengthSessionLog => {
        const exercise = state.exercises.find((item) => item.id === log.exerciseId)!;
        return {
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          equipment: exercise.equipment || [],
          weightMode: exercise.weightMode === 'total' ? 'total' : 'per-hand',
          weightKg: weightLogs[log.exerciseId],
          setsCompleted: log.setsCompleted,
          repetitions: log.repetitions,
          authorizedByUserOrProfessional: exercise.approvalStatus === 'approved' || exercise.requiresProfessionalApproval,
        };
      });
    setState((current) => ({
      ...current,
      sessions: [...current.sessions, {
        id: crypto.randomUUID(),
        date: now.toISOString().slice(0, 10),
        savedAt: now.toISOString(),
        routineId: routine.id,
        durationMinutes: Math.max(1, Math.round(logs.reduce((sum, log) => sum + (log.setsCompleted * log.workSeconds) + Math.max(0, log.setsCompleted - 1) * log.restSeconds, 0) / 60)),
        completedExerciseIds: completed,
        walked,
        exerciseLogs: logs,
        strengthLogs,
        stiffness: todayCheckIn?.stiffness,
        sleepHours: todayCheckIn?.sleepHours,
        sleepQuality: todayCheckIn?.sleepQuality,
        mood: todayCheckIn?.mood,
        ...form,
      }],
    }));
    setMode('done');
    setFinishOpen(false);
    setSavedOpen(true);
  };

  const lastWeight = activeExercise ? findLastWeight(state, activeExercise.id) : undefined;

  return (
    <div className="space-y-5">
      <div className="sticky-progress no-print rounded-2xl border border-app-border bg-app-surface/90 p-3 shadow-soft">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-calmgreen">Progreso de sesión</p>
            <p className="text-sm font-semibold text-app-primaryDark">{percent}% completado · tiempo restante estimado {formatSeconds(remainingSeconds)}</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-petrol-50 sm:w-72" aria-label={`${percent}% completado`}>
            <div className="h-full rounded-full bg-calmgreen transition-all duration-300" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-petrol-700">Rutina</h2>
          <p className="text-slate-600">Ejercicios programados para realizar hoy. La biblioteca contiene todos los ejercicios disponibles.</p>
        </div>
        <select className="min-h-11 rounded-xl border border-petrol-100 bg-white px-3 font-semibold text-petrol-700" value={routine.id} onChange={(event) => setRoutineId(event.target.value)}>{state.routines.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      </div>

      <Card className="exercise-transition">
        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-calmgreen">{routine.name}</p>
                <h3 className="mt-1 text-2xl font-bold text-petrol-700">{activeExercise?.name || 'Sin ejercicios en esta rutina'}</h3>
                <p className="mt-1 text-sm text-slate-600">{activeExercise ? `Ejercicio ${activeIndex + 1} de ${items.length} · ${activeExercise.category} · serie ${activeSet}/${totalSets}` : 'Añade ejercicios desde la Biblioteca de ejercicios.'}</p>
                <p className="mt-2 text-sm font-semibold text-app-primaryDark">Siguiente: {nextExercise?.name || 'finalizar registro de sesión'}</p>
              </div>
              <ProgressRing percent={percent} />
            </div>
            <div className="grid gap-3 md:grid-cols-[220px_1fr]">
              {activeExercise?.photoUrl && <img className="h-48 w-full rounded-xl object-cover" src={activeExercise.photoUrl} alt={`Foto de ${activeExercise.name}`} />}
              <div className="rounded-xl bg-petrol-50 p-4">
                <div className="flex items-center gap-2 text-petrol-700"><Clock className="size-5" /><span className="font-bold">{modeLabel(mode)}</span></div>
                <p className="mt-3 text-5xl font-bold tabular-nums text-petrol-700">{formatSeconds(secondsLeft || workSeconds)}</p>
                <p className="mt-2 text-sm text-slate-600">Trabajo {workSeconds}s · descanso {restSeconds}s · cambio automático entre series.</p>
                <p className="mt-1 text-sm font-semibold text-app-primaryDark">Restante de sesión: {formatSeconds(remainingSeconds)} · series restantes {Math.max(0, totalSets - activeSet + 1)}</p>
                {activeExercise?.progressionNotes && <p className="mt-3 rounded-lg bg-white p-3 text-sm font-semibold text-slate-700">{activeExercise.progressionNotes}</p>}
              </div>
            </div>
            {activeExercise?.weightMode && activeExercise.weightMode !== 'none' && (
              <div className="rounded-xl border border-petrol-100 bg-white p-4">
                <div className="flex items-center gap-2 font-bold text-petrol-700"><Dumbbell className="size-5" /> Peso de esta sesión</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label className="text-sm font-semibold text-slate-700">Kg {activeExercise.weightMode === 'per-hand' ? 'por mano' : 'totales'}<input className="mt-1 min-h-11 w-full rounded-xl border border-petrol-100 px-3" type="number" min="0" step="0.5" value={weightLogs[activeExercise.id] ?? 0} onChange={(event) => setWeightLogs({ ...weightLogs, [activeExercise.id]: Number(event.target.value) })} /></label>
                  <Button variant="secondary" disabled={lastWeight === undefined} onClick={() => setWeightLogs({ ...weightLogs, [activeExercise.id]: lastWeight || 0 })}>Usar último peso</Button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Último peso registrado: {lastWeight !== undefined ? `${lastWeight} kg` : 'sin registros previos'}. La app no sube el peso automáticamente.</p>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-petrol-100 p-4">
            <h3 className="font-bold text-petrol-700">Control de sesión</h3>
            <div className="mt-3 grid gap-2">
              <Button onClick={start} disabled={!activeExercise || mode === 'prep' || mode === 'work' || mode === 'rest'}><Play className="size-5" /> Comenzar rutina automática</Button>
              <Button variant="ghost" onClick={pause} disabled={mode !== 'prep' && mode !== 'work' && mode !== 'rest'}><Pause className="size-5" /> Pausar</Button>
              <Button variant="secondary" onClick={resume} disabled={mode !== 'paused'}><TimerReset className="size-5" /> Continuar</Button>
              <Button variant="ghost" onClick={toggleFullscreen}><Maximize2 className="size-5" /> Pantalla completa</Button>
              <Button variant="ghost" onClick={() => setState((current) => ({ ...current, preferences: { ...current.preferences, relaxingSoundEnabled: !current.preferences.relaxingSoundEnabled } }))}><Volume2 className="size-5" /> Sonido relajante</Button>
              <Button variant="danger" onClick={stopSession}><ShieldAlert className="size-5" /> Detener sesión</Button>
              <Button variant="ghost" onClick={() => setFinishOpen(true)}><Square className="size-5" /> Finalizar sesión</Button>
            </div>
            <p className="mt-3 text-sm text-slate-600">{completed.length}/{items.length} ejercicios completados · {percent}%</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {items.map((item, index) => item.exercise && (
          <Card key={item.exerciseId} className={`${completed.includes(item.exerciseId) ? 'border-calmgreen bg-green-50' : ''} ${index === activeIndex ? 'ring-2 ring-aqua' : ''}`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-3">
                <button aria-label={`Marcar ${item.exercise.name}`} onClick={() => toggleComplete(item)} className={`grid size-12 shrink-0 place-items-center rounded-xl border-2 ${completed.includes(item.exerciseId) ? 'border-calmgreen bg-calmgreen text-white' : 'border-petrol-100 bg-white text-petrol-700'}`}>{completed.includes(item.exerciseId) ? <Check /> : index + 1}</button>
                <img className="size-16 rounded-xl object-cover" src={item.exercise.photoUrl} alt="" />
                <div>
                  <h3 className="font-bold text-petrol-700">{item.exercise.name}</h3>
                  <p className="text-sm text-slate-600">{item.exercise.category} · {formatSets(getSets(item))} · {item.repetitions || item.exercise.repetitions || item.duration || item.exercise.duration} · descanso {item.rest || item.exercise.rest}</p>
                  <p className="text-sm font-semibold text-calmgreen">{completed.includes(item.exerciseId) ? 'Completado y registrado' : index === activeIndex ? 'Ejercicio activo' : 'Pendiente'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => move(index, -1)} aria-label="Subir ejercicio"><ChevronUp className="size-5" /></Button>
                <Button variant="ghost" onClick={() => move(index, 1)} aria-label="Bajar ejercicio"><ChevronDown className="size-5" /></Button>
                <Button variant="secondary" onClick={() => setOpenedExercise(item.exercise!)}>Abrir ejercicio</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {finishOpen && (
        <Modal title="Registro completo de la sesión" onClose={() => setFinishOpen(false)}>
          <div className="space-y-4">
            <PainScale label="Dolor antes de la sesión" value={form.painBefore} onChange={(painBefore) => setForm({ ...form, painBefore })} />
            <PainScale label="Dolor después de la sesión" value={form.painAfter} onChange={(painAfter) => setForm({ ...form, painAfter })} />
            <label className="block font-semibold text-petrol-700">Fatiga <span className="rounded-full bg-petrol-50 px-2 py-1 text-sm">{form.fatigue}/10</span><input className="mt-2 h-3 w-full accent-petrol-500" type="range" min="0" max="10" value={form.fatigue} onChange={(event) => setForm({ ...form, fatigue: Number(event.target.value) })} /></label>
            {includesWalking && <p className="rounded-xl bg-petrol-50 p-3 text-sm font-semibold text-petrol-700">Caminata suave: {walked ? 'completada como parte de la rutina' : 'no marcada como completada'}</p>}
            <textarea className="min-h-24 w-full rounded-xl border border-petrol-100 p-3" placeholder="Observaciones clínicas, tolerancia, síntomas o indicaciones profesionales" value={form.observations} onChange={(event) => setForm({ ...form, observations: event.target.value })} />
            <textarea className="min-h-20 w-full rounded-xl border border-petrol-100 p-3" placeholder="Incidencias durante la sesión" value={form.incidents} onChange={(event) => setForm({ ...form, incidents: event.target.value })} />
            <Button onClick={saveSession}><Save className="size-5" /> Guardar sesión</Button>
          </div>
        </Modal>
      )}
      {savedOpen && <Modal title="Sesión guardada" onClose={() => setSavedOpen(false)}><p className="text-slate-700">El historial, las estadísticas y los registros por ejercicio se han actualizado.</p></Modal>}
      {openedExercise && <ExerciseDetail exercise={openedExercise} onClose={() => setOpenedExercise(null)} onStart={() => {
        const index = items.findIndex((item) => item.exerciseId === openedExercise.id);
        if (index >= 0) {
          setActiveIndex(index);
          setActiveSet(1);
          setMode('prep');
          setSecondsLeft(3);
        }
      }} />}
    </div>
  );
}

function getSets(item?: SessionItem) {
  return item?.sets || item?.exercise?.plannedSets || item?.exercise?.sets || 1;
}

function getWorkSeconds(item?: SessionItem) {
  if (!item?.exercise) return 30;
  return item.workSeconds || item.exercise.workSeconds || secondsFromLabel(item.duration || item.exercise.duration) || (item.exercise.repetitions ? 45 : 30);
}

function getRestSeconds(item?: SessionItem) {
  if (!item?.exercise) return 30;
  return item.restSeconds || item.exercise.restSeconds || secondsFromLabel(item.rest || item.exercise.rest) || 45;
}

function getRemainingSeconds(items: SessionItem[], activeIndex: number, activeSet: number, mode: TimerMode, secondsLeft: number) {
  return items.reduce((sum, item, index) => {
    if (index < activeIndex) return sum;
    const sets = getSets(item);
    const work = getWorkSeconds(item);
    const rest = getRestSeconds(item);
    if (index === activeIndex) {
      const pendingSets = Math.max(0, sets - activeSet);
      const current = mode === 'work' || mode === 'rest' || mode === 'paused' ? secondsLeft : work;
      return sum + current + pendingSets * (work + rest);
    }
    return sum + sets * work + Math.max(0, sets - 1) * rest;
  }, 0);
}

function secondsFromLabel(label?: string) {
  if (!label) return undefined;
  const seconds = label.match(/(\d+)\s*s/);
  if (seconds) return Number(seconds[1]);
  const minutes = label.match(/(\d+)\s*min/);
  if (minutes) return Number(minutes[1]) * 60;
  return undefined;
}

function formatSets(sets: number) {
  return `${sets} ${sets === 1 ? 'serie' : 'series'}`;
}

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function modeLabel(mode: TimerMode) {
  if (mode === 'prep') return 'Preparación';
  if (mode === 'work') return 'Trabajo';
  if (mode === 'rest') return 'Descanso';
  if (mode === 'paused') return 'Pausado';
  if (mode === 'done') return 'Sesión finalizada';
  return 'Listo para empezar';
}

function findLastWeight(state: AppState, exerciseId: string) {
  for (const session of state.sessions.slice().reverse()) {
    const log = session.strengthLogs?.find((item) => item.exerciseId === exerciseId);
    if (log) return log.weightKg;
  }
  return undefined;
}
