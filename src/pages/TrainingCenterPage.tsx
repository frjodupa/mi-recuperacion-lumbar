import { Bike, Bookmark, CalendarPlus, Copy, Dumbbell, HeartPulse, Layers3, Plus, Search, Star, StretchHorizontal, Trash2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import { Button, Card, EmptyState, ExercisePhoto, Modal } from '../components/ui';
import { fitnessFilters, plannedTrainingCatalog, trainingCatalog, trainingTabs } from '../data/trainingCatalog';
import type { AppState, TrainingExercise, TrainingMuscleGroup, TrainingRoutine, TrainingTab } from '../types';

type RoutineDraft = {
  name: string;
  exerciseIds: string[];
};

const tabIcons: Record<TrainingTab, typeof HeartPulse> = {
  recovery: HeartPulse,
  fitness: Dumbbell,
  stretching: StretchHorizontal,
  cardio: Bike,
  'movement-library': Layers3,
  favorites: Star,
  'my-routines': CalendarPlus,
};

export function TrainingCenterPage({ state, setState }: { state: AppState; setState: Dispatch<SetStateAction<AppState>> }) {
  const [activeTab, setActiveTab] = useState<TrainingTab>('fitness');
  const [filter, setFilter] = useState<'Todos' | TrainingMuscleGroup>('Todos');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<TrainingExercise | null>(null);
  const [draft, setDraft] = useState<RoutineDraft>({ name: '', exerciseIds: [] });
  const favorites = new Set(state.trainingCenter.favorites);
  const normalizedQuery = query.trim().toLowerCase();
  const availableEquipment = Object.entries(state.preferences.equipment).filter(([, enabled]) => enabled).length;
  const favoriteExercises = trainingCatalog.filter((exercise) => favorites.has(exercise.id));
  const routines = state.trainingCenter.routines;

  const visibleExercises = useMemo(() => trainingCatalog.filter((exercise) => {
    const tabMatch = activeTab === 'favorites'
      ? favorites.has(exercise.id)
      : activeTab === 'my-routines'
        ? false
        : exercise.tab === activeTab || (activeTab === 'stretching' && exercise.muscleGroup === 'Movilidad') || (activeTab === 'cardio' && exercise.equipment.some((item) => item.includes('Bicicleta') || item.includes('Cinta')));
    const filterMatch = filter === 'Todos' || exercise.muscleGroup === filter;
    const queryMatch = !normalizedQuery || [exercise.name, exercise.muscleGroup, exercise.description, exercise.equipment.join(' ')].some((value) => value.toLowerCase().includes(normalizedQuery));
    return tabMatch && filterMatch && queryMatch;
  }), [activeTab, favorites, filter, normalizedQuery]);

  const toggleFavorite = (exerciseId: string) => {
    setState((current) => {
      const currentFavorites = new Set(current.trainingCenter.favorites);
      if (currentFavorites.has(exerciseId)) currentFavorites.delete(exerciseId);
      else currentFavorites.add(exerciseId);
      return {
        ...current,
        trainingCenter: {
          ...current.trainingCenter,
          favorites: Array.from(currentFavorites),
        },
      };
    });
  };

  const addToDraft = (exerciseId: string) => {
    setDraft((current) => current.exerciseIds.includes(exerciseId)
      ? current
      : { ...current, exerciseIds: [...current.exerciseIds, exerciseId] });
  };

  const removeFromDraft = (exerciseId: string) => {
    setDraft((current) => ({ ...current, exerciseIds: current.exerciseIds.filter((id) => id !== exerciseId) }));
  };

  const saveRoutine = () => {
    const name = draft.name.trim();
    if (!name || draft.exerciseIds.length === 0) return;
    const now = new Date().toISOString();
    const routine: TrainingRoutine = {
      id: `training-routine-${Date.now()}`,
      name,
      description: `${draft.exerciseIds.length} ejercicios del Centro de Entrenamiento`,
      exerciseIds: draft.exerciseIds,
      createdAt: now,
      updatedAt: now,
    };
    setState((current) => ({
      ...current,
      trainingCenter: {
        ...current.trainingCenter,
        routines: [routine, ...current.trainingCenter.routines],
      },
    }));
    setDraft({ name: '', exerciseIds: [] });
    setActiveTab('my-routines');
  };

  const duplicateRoutine = (routine: TrainingRoutine) => {
    const now = new Date().toISOString();
    setState((current) => ({
      ...current,
      trainingCenter: {
        ...current.trainingCenter,
        routines: [{
          ...routine,
          id: `training-routine-${Date.now()}`,
          name: `${routine.name} copia`,
          createdAt: now,
          updatedAt: now,
        }, ...current.trainingCenter.routines],
      },
    }));
  };

  const deleteRoutine = (routineId: string) => {
    setState((current) => ({
      ...current,
      trainingCenter: {
        ...current.trainingCenter,
        routines: current.trainingCenter.routines.filter((routine) => routine.id !== routineId),
      },
    }));
  };

  const editRoutineName = (routineId: string, name: string) => {
    setState((current) => ({
      ...current,
      trainingCenter: {
        ...current.trainingCenter,
        routines: current.trainingCenter.routines.map((routine) => routine.id === routineId ? { ...routine, name, updatedAt: new Date().toISOString() } : routine),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-petrol-700 via-petrol-600 to-calmgreen p-6 text-white shadow-[0_26px_90px_rgba(15,92,99,0.22)] md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-3 py-1 text-sm font-bold backdrop-blur"><Dumbbell className="size-4" /> Nuevo módulo premium</p>
            <h2 className="mt-5 text-4xl font-bold leading-none tracking-[-0.04em] md:text-6xl">Centro de Entrenamiento</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/82">Ejercicios seguros para potenciar tu recuperación y mejorar tu condición física.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <HeroMetric label="Ejercicios" value={trainingCatalog.length} />
            <HeroMetric label="Categorías" value={plannedTrainingCatalog.length} />
            <HeroMetric label="Favoritos" value={favoriteExercises.length} />
            <HeroMetric label="Rutinas" value={routines.length} />
            <HeroMetric label="Material activo" value={availableEquipment} />
            <HeroMetric label="Escalable" value="150+" />
          </div>
        </div>
      </section>

      <Card className="no-print p-4">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Secciones del centro de entrenamiento">
          {trainingTabs.map((tab) => {
            const Icon = tabIcons[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`animate-soft inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[18px] border px-4 text-sm font-bold transition ${activeTab === tab.id ? 'border-petrol-500 bg-petrol-500 text-white shadow-soft' : 'border-app-border bg-white/70 text-petrol-700 hover:bg-petrol-50'}`}
              >
                <Icon className="size-4" aria-hidden />
                {tab.label}
              </button>
            );
          })}
        </div>
      </Card>

      {activeTab !== 'my-routines' ? (
        <>
          <Card className="no-print p-5">
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-petrol-700">Buscar movimientos</span>
                <span className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                  <input
                    className="min-h-13 w-full rounded-[20px] border border-app-border bg-white/78 py-3 pl-12 pr-4 text-slate-800 shadow-sm"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por nombre, grupo muscular o material"
                  />
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {fitnessFilters.map((item) => (
                  <button key={item} type="button" onClick={() => setFilter(item)} className={`animate-soft min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold transition ${filter === item ? 'border-petrol-500 bg-petrol-500 text-white shadow-sm' : 'border-app-border bg-white/70 text-petrol-700 hover:bg-petrol-50'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3 min-[1720px]:grid-cols-4">
            {visibleExercises.length ? visibleExercises.map((exercise) => (
              <TrainingExerciseCard
                key={exercise.id}
                exercise={exercise}
                favorite={favorites.has(exercise.id)}
                inDraft={draft.exerciseIds.includes(exercise.id)}
                onFavorite={() => toggleFavorite(exercise.id)}
                onOpen={() => setSelected(exercise)}
                onAdd={() => addToDraft(exercise.id)}
              />
            )) : <div className="md:col-span-2 2xl:col-span-3 min-[1720px]:col-span-4"><EmptyState title="Sin ejercicios" body="Ajusta la búsqueda, cambia de pestaña o guarda ejercicios como favoritos." /></div>}
          </div>
        </>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <RoutineBuilder draft={draft} setDraft={setDraft} onSave={saveRoutine} onRemove={removeFromDraft} />
        <RoutinesPanel routines={routines} onDuplicate={duplicateRoutine} onDelete={deleteRoutine} onRename={editRoutineName} />
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">Preparado para crecer</p>
            <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-petrol-700">Estructura lista para vídeos, cargas, temporizadores y evolución</h3>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">El modelo separa catálogo, favoritos y rutinas de entrenamiento para poder añadir cronómetro, peso utilizado, historial de fuerza, estadísticas y nuevos equipos sin rehacer el núcleo de rehabilitación.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniCapability label="Fotos" value="3 por ejercicio" />
            <MiniCapability label="Datos" value="Tipados" />
            <MiniCapability label="Offline" value="PWA" />
          </div>
        </div>
      </Card>

      {selected && <TrainingExerciseDetail exercise={selected} favorite={favorites.has(selected.id)} onFavorite={() => toggleFavorite(selected.id)} onClose={() => setSelected(null)} onAdd={() => addToDraft(selected.id)} />}
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[24px] border border-white/16 bg-white/12 p-4 backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-[-0.03em]">{value}</p>
    </div>
  );
}

function TrainingExerciseCard({ exercise, favorite, inDraft, onFavorite, onOpen, onAdd }: { exercise: TrainingExercise; favorite: boolean; inDraft: boolean; onFavorite: () => void; onOpen: () => void; onAdd: () => void }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0">
      <div className="relative">
        <img className="aspect-[16/10] w-full bg-petrol-50 object-cover" src={exercise.images.main} alt={`Foto real de ${exercise.name}`} loading="lazy" />
        <button type="button" onClick={onFavorite} className={`absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/60 backdrop-blur-xl transition ${favorite ? 'bg-petrol-500 text-white' : 'bg-white/82 text-petrol-700 hover:bg-white'}`} aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
          <Star className={`size-5 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">{exercise.muscleGroup}</p>
            <h3 className="mt-1 text-xl font-bold tracking-[-0.03em] text-petrol-700">{exercise.name}</h3>
          </div>
          <span className="rounded-full bg-petrol-50 px-3 py-1 text-xs font-bold text-petrol-700">{exercise.level}</span>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <InfoPill label="Material" value={exercise.equipment.join(' · ')} />
          <InfoPill label="Series" value={exercise.sets} />
          <InfoPill label="Reps" value={exercise.repetitions} />
          <InfoPill label="Descanso" value={exercise.rest} />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button variant="ghost" onClick={onOpen}>Ver ejercicio</Button>
          <Button variant={inDraft ? 'secondary' : 'primary'} onClick={onAdd}><Plus className="size-4" /> {inDraft ? 'Añadido' : 'Añadir'}</Button>
        </div>
      </div>
    </Card>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-app-border bg-white/58 px-3 py-2">
      <span className="mr-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <span className="font-semibold text-petrol-700">{value}</span>
    </div>
  );
}

function RoutineBuilder({ draft, setDraft, onSave, onRemove }: { draft: RoutineDraft; setDraft: Dispatch<SetStateAction<RoutineDraft>>; onSave: () => void; onRemove: (exerciseId: string) => void }) {
  const draftExercises = draft.exerciseIds.map((id) => trainingCatalog.find((exercise) => exercise.id === id)).filter(Boolean) as TrainingExercise[];
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Crear rutina</p>
      <h3 className="mt-1 text-2xl font-bold text-petrol-700">Mis rutinas</h3>
      <input className="mt-4 min-h-12 w-full rounded-[18px] border border-app-border bg-white/78 px-4 font-semibold text-slate-800" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Nombre de la rutina" />
      <div className="mt-4 space-y-2">
        {draftExercises.length ? draftExercises.map((exercise) => (
          <div key={exercise.id} className="flex items-center justify-between gap-3 rounded-2xl border border-app-border bg-white/58 p-3">
            <div>
              <p className="font-bold text-petrol-700">{exercise.name}</p>
              <p className="text-sm text-slate-600">{exercise.muscleGroup} · {exercise.equipment.join(' · ')}</p>
            </div>
            <button type="button" onClick={() => onRemove(exercise.id)} className="grid size-10 place-items-center rounded-xl text-app-danger hover:bg-red-50" aria-label={`Quitar ${exercise.name}`}><Trash2 className="size-4" /></button>
          </div>
        )) : <EmptyState title="Rutina vacía" body="Añade ejercicios desde cualquier tarjeta del catálogo." />}
      </div>
      <Button className="mt-4 w-full" onClick={onSave} disabled={!draft.name.trim() || draft.exerciseIds.length === 0}><CalendarPlus className="size-5" /> Guardar rutina</Button>
    </Card>
  );
}

function RoutinesPanel({ routines, onDuplicate, onDelete, onRename }: { routines: TrainingRoutine[]; onDuplicate: (routine: TrainingRoutine) => void; onDelete: (routineId: string) => void; onRename: (routineId: string, name: string) => void }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Rutinas creadas</p>
      <h3 className="mt-1 text-2xl font-bold text-petrol-700">Biblioteca personal</h3>
      <div className="mt-4 space-y-3">
        {routines.length ? routines.map((routine) => (
          <div key={routine.id} className="rounded-[24px] border border-app-border bg-white/58 p-4">
            <input className="min-h-11 w-full rounded-2xl border border-app-border bg-white/70 px-3 text-lg font-bold text-petrol-700" value={routine.name} onChange={(event) => onRename(routine.id, event.target.value)} aria-label="Editar nombre de rutina" />
            <p className="mt-2 text-sm text-slate-600">{routine.exerciseIds.length} ejercicios · actualizado {new Date(routine.updatedAt).toLocaleDateString('es-ES')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => onDuplicate(routine)}><Copy className="size-4" /> Duplicar</Button>
              <Button variant="danger" onClick={() => onDelete(routine.id)}><Trash2 className="size-4" /> Eliminar</Button>
            </div>
          </div>
        )) : <EmptyState title="Aún no hay rutinas" body="Crea una rutina con tus ejercicios favoritos y guárdala aquí." />}
      </div>
    </Card>
  );
}

function MiniCapability({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-28 rounded-2xl border border-app-border bg-white/58 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-petrol-700">{value}</p>
    </div>
  );
}

function TrainingExerciseDetail({ exercise, favorite, onFavorite, onClose, onAdd }: { exercise: TrainingExercise; favorite: boolean; onFavorite: () => void; onClose: () => void; onAdd: () => void }) {
  return (
    <Modal title={exercise.name} onClose={onClose}>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <img className="aspect-[16/9] w-full rounded-[28px] border border-app-border bg-petrol-50 object-cover" src={exercise.images.main} alt={`Foto principal de ${exercise.name}`} />
          <div className="grid gap-3 sm:grid-cols-2">
            <ExercisePhoto label="Posición inicial" src={exercise.images.start} />
            <ExercisePhoto label="Posición final" src={exercise.images.end} />
          </div>
        </div>
        <div className="space-y-4">
          <section className="rounded-[26px] border border-app-border bg-petrol-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">{exercise.muscleGroup} · {exercise.level}</p>
            <p className="mt-2 leading-relaxed text-slate-700">{exercise.description}</p>
          </section>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoPill label="Series" value={exercise.sets} />
            <InfoPill label="Reps" value={exercise.repetitions} />
            <InfoPill label="Descanso" value={exercise.rest} />
            <InfoPill label="Fase" value={exercise.rehabPhase.replace('fase-', 'Fase ')} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={onAdd}><Plus className="size-5" /> Añadir a rutina</Button>
            <Button className="flex-1" variant="secondary" onClick={onFavorite}><Bookmark className="size-5" /> {favorite ? 'Favorito' : 'Guardar'}</Button>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailBlock title="Músculos implicados" items={exercise.muscles} />
        <DetailBlock title="Beneficios" items={exercise.benefits} />
        <DetailBlock title="Ejecución paso a paso" items={exercise.steps} />
        <DetailBlock title="Errores frecuentes" items={exercise.commonErrors} />
        <DetailBlock title="Respiración" items={[exercise.breathing]} />
        <DetailBlock title="Peso recomendado" items={[exercise.recommendedWeight]} />
        <DetailBlock title="Progresiones" items={exercise.progressions} />
        <DetailBlock title="Contraindicaciones" items={exercise.contraindications} />
        <DetailBlock title="Material necesario" items={exercise.equipment} />
      </div>
    </Modal>
  );
}

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[24px] border border-app-border bg-white/58 p-4">
      <h3 className="font-bold text-petrol-700">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
