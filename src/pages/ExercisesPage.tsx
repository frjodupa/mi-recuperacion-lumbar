import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseDetail } from '../components/ExerciseDetail';
import { Button, Card, ConfirmDialog, EmptyState, Modal } from '../components/ui';
import type { AppState, Difficulty, EquipmentKey, Exercise, ExerciseCategory, PhaseId } from '../types';

const categories: ExerciseCategory[] = ['Activación lumbar', 'Movilidad controlada', 'Estabilidad', 'Glúteos y piernas', 'Banco y mancuernas', 'Bandas elásticas', 'Estiramientos', 'Caminata y actividad suave', 'Requiere autorización'];
type CategoryFilter = 'Todas' | ExerciseCategory;
type MaterialFilter = 'all' | EquipmentKey | 'none';

const chipLabels: Record<CategoryFilter, string> = {
  Todas: 'Todos',
  'Activación lumbar': 'Activación',
  'Movilidad controlada': 'Movilidad',
  Estabilidad: 'Estabilidad',
  'Glúteos y piernas': 'Glúteos',
  'Banco y mancuernas': 'Banco',
  'Bandas elásticas': 'Bandas',
  Estiramientos: 'Estiramientos',
  'Caminata y actividad suave': 'Caminata',
  'Requiere autorización': 'Autorización',
};

const materialOptions: { key: MaterialFilter; label: string }[] = [
  { key: 'all', label: 'Material disponible' },
  { key: 'none', label: 'Sin material' },
  { key: 'bench', label: 'Banco' },
  { key: 'dumbbells', label: 'Mancuernas' },
  { key: 'bands', label: 'Bandas' },
  { key: 'mat', label: 'Esterilla' },
  { key: 'chair', label: 'Silla' },
  { key: 'wall', label: 'Pared' },
  { key: 'walkingSpace', label: 'Caminata' },
  { key: 'stationaryBike', label: 'Bicicleta estática' },
  { key: 'treadmill', label: 'Cinta de correr' },
];

export function ExercisesPage({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [category, setCategory] = useState<CategoryFilter>('Todas');
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [material, setMaterial] = useState<MaterialFilter>('all');
  const [level, setLevel] = useState<'all' | Difficulty>('all');
  const [phase, setPhase] = useState<'all' | PhaseId>('all');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [addedToRoutine, setAddedToRoutine] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [exerciseToAdd, setExerciseToAdd] = useState<Exercise | null>(null);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);
  const [routineMessage, setRoutineMessage] = useState('');
  const routineExerciseIds = useMemo(
    () => new Set(state.routines.flatMap((routine) => routine.exercises.map((item) => item.exerciseId))),
    [state.routines],
  );
  const isEquipmentAvailable = (exercise: Exercise) => !exercise.equipment?.some((key) => !state.preferences.equipment[key]);
  const availableCount = state.exercises.filter((exercise) => exercise.enabled && isEquipmentAvailable(exercise)).length;
  const hiddenCount = state.exercises.length - availableCount;
  const normalizedQuery = query.trim().toLowerCase();
  const exercises = useMemo(() => state.exercises.filter((exercise) => {
    const equipmentAvailable = !exercise.equipment?.some((key) => !state.preferences.equipment[key]);
    const matchesCategory = category === 'Todas' || exercise.category === category;
    const matchesQuery = !normalizedQuery || [exercise.name, exercise.category, exercise.description].some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesMaterial = material === 'all' || (material === 'none' ? !exercise.equipment?.length : exercise.equipment?.includes(material));
    const matchesLevel = level === 'all' || exercise.difficulty === level;
    const matchesPhase = phase === 'all' || exercise.phase === phase;
    const matchesApproval = !requiresApproval || exercise.requiresProfessionalApproval;
    const matchesRoutine = !addedToRoutine || routineExerciseIds.has(exercise.id);
    const visibleByDefault = showHidden || (exercise.enabled && equipmentAvailable);
    return visibleByDefault && matchesCategory && matchesQuery && matchesMaterial && matchesLevel && matchesPhase && matchesApproval && matchesRoutine;
  }), [addedToRoutine, category, level, material, normalizedQuery, phase, requiresApproval, routineExerciseIds, showHidden, state.exercises, state.preferences.equipment]);

  const clearFilters = () => {
    setCategory('Todas');
    setQuery('');
    setMaterial('all');
    setLevel('all');
    setPhase('all');
    setRequiresApproval(false);
    setAddedToRoutine(false);
    setShowHidden(false);
  };

  const addToRoutine = (exerciseId: string, routineId: string) => {
    const routine = state.routines.find((item) => item.id === routineId);
    if (!routine) return;

    if (routine.exercises.some((item) => item.exerciseId === exerciseId)) {
      setRoutineMessage(`Este ejercicio ya está en "${routine.name}".`);
      return;
    }

    setState((current) => ({
      ...current,
      routines: current.routines.map((item) => item.id === routineId
        ? { ...item, exercises: [...item.exercises, { exerciseId, order: item.exercises.length + 1, rest: '60 s' }] }
        : item),
    }));
    setRoutineMessage(`Ejercicio añadido a "${routine.name}".`);
    window.setTimeout(() => {
      setExerciseToAdd(null);
      setRoutineMessage('');
    }, 650);
  };

  const toggle = (exerciseId: string) => setState((current) => ({ ...current, exercises: current.exercises.map((exercise) => exercise.id === exerciseId ? { ...exercise, enabled: !exercise.enabled } : exercise) }));
  const remove = (exerciseId: string) => {
    setState((current) => ({ ...current, exercises: current.exercises.filter((exercise) => exercise.id !== exerciseId), routines: current.routines.map((routine) => ({ ...routine, exercises: routine.exercises.filter((item) => item.exerciseId !== exerciseId) })) }));
    setExerciseToDelete(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold text-petrol-700">Biblioteca de ejercicios</h2>
        <p className="max-w-3xl text-slate-600">La biblioteca reúne todos los ejercicios disponibles. Desde aquí puedes consultar la ficha de cada ejercicio y añadirlo a una rutina concreta. La rutina es la lista programada que realizarás en una sesión.</p>
      </div>
      <Card className="no-print">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-petrol-700">Buscar en la biblioteca</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                className="min-h-12 w-full rounded-xl border border-app-border bg-white py-3 pl-11 pr-4 text-slate-800 shadow-sm"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre, categoría u objetivo"
                aria-label="Buscar ejercicios en la biblioteca"
              />
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-petrol-50 p-3 text-center">
            <div><p className="text-xl font-bold text-petrol-700">{state.exercises.length}</p><p className="text-xs font-semibold text-slate-500">Total</p></div>
            <div><p className="text-xl font-bold text-calmgreen">{availableCount}</p><p className="text-xs font-semibold text-slate-500">Visibles</p></div>
            <div><p className="text-xl font-bold text-slate-500">{hiddenCount}</p><p className="text-xs font-semibold text-slate-500">Ocultos</p></div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(['Todas', ...categories] as CategoryFilter[]).map((item) => (
                <button key={item} className={`animate-soft h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition ${category === item ? 'border-petrol-500 bg-petrol-500 text-white shadow-sm' : 'border-app-border bg-white text-petrol-700 hover:bg-petrol-50'}`} onClick={() => setCategory(item)}>
                  {chipLabels[item]}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 h-10 w-10 bg-gradient-to-l from-white to-transparent" />
          </div>
          <Button variant="ghost" className="h-10 shrink-0 px-3" onClick={() => setFiltersOpen((value) => !value)}><SlidersHorizontal className="size-4" /> Filtros</Button>
        </div>
        {filtersOpen && (
          <div className="mt-4 grid gap-3 rounded-2xl border border-app-border bg-white p-4 md:grid-cols-3">
            <label className="text-sm font-semibold text-petrol-700">Material
              <select className="mt-1 block min-h-11 w-full rounded-xl border border-app-border bg-white px-3" value={material} onChange={(event) => setMaterial(event.target.value as MaterialFilter)}>
                {materialOptions.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-petrol-700">Nivel
              <select className="mt-1 block min-h-11 w-full rounded-xl border border-app-border bg-white px-3" value={level} onChange={(event) => setLevel(event.target.value as 'all' | Difficulty)}>
                <option value="all">Todos los niveles</option>
                <option value="Suave">Suave</option>
                <option value="Moderada">Moderada</option>
                <option value="Avanzada">Avanzada</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-petrol-700">Fase
              <select className="mt-1 block min-h-11 w-full rounded-xl border border-app-border bg-white px-3" value={phase} onChange={(event) => setPhase(event.target.value as 'all' | PhaseId)}>
                <option value="all">Todas las fases</option>
                <option value="fase-1">Fase 1</option>
                <option value="fase-2">Fase 2</option>
                <option value="fase-3">Fase 3</option>
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-app-border p-3 text-sm font-semibold text-slate-700"><input className="size-5 accent-petrol-500" type="checkbox" checked={requiresApproval} onChange={(event) => setRequiresApproval(event.target.checked)} /> Requiere autorización</label>
            <label className="flex items-center gap-3 rounded-xl border border-app-border p-3 text-sm font-semibold text-slate-700"><input className="size-5 accent-petrol-500" type="checkbox" checked={addedToRoutine} onChange={(event) => setAddedToRoutine(event.target.checked)} /> Añadido a mi rutina</label>
            <label className="flex items-center gap-3 rounded-xl border border-app-border p-3 text-sm font-semibold text-slate-700"><input className="size-5 accent-petrol-500" type="checkbox" checked={showHidden} onChange={(event) => setShowHidden(event.target.checked)} /> Ocultos y no disponibles</label>
            <div className="md:col-span-3"><Button variant="ghost" onClick={clearFilters}>Limpiar filtros</Button></div>
          </div>
        )}
        <p className="mt-3 text-sm font-semibold text-slate-600">{exercises.length} ejercicios encontrados</p>
      </Card>
      <div className="space-y-4">
        {exercises.length ? exercises.map((exercise) => {
          const equipmentAvailable = isEquipmentAvailable(exercise);
          const availabilityNote = !equipmentAvailable ? 'No disponible con tu equipamiento actual' : exercise.unavailableReason;
          const canAdd = exercise.enabled && equipmentAvailable;
          return <ExerciseCard key={exercise.id} exercise={exercise} canAdd={canAdd} availabilityNote={availabilityNote} onOpen={() => setSelected(exercise)} onAdd={() => { if (!canAdd) return; setExerciseToAdd(exercise); setRoutineMessage(''); }} onToggle={() => toggle(exercise.id)} onDelete={() => setExerciseToDelete(exercise)} />;
        }) : <EmptyState title="Sin resultados" body="No hay ejercicios que coincidan con la búsqueda y los filtros actuales." />}
      </div>
      {selected && <ExerciseDetail exercise={selected} onClose={() => setSelected(null)} />}
      {exerciseToDelete && (
        <ConfirmDialog
          title="Eliminar ejercicio"
          body={`Vas a eliminar "${exerciseToDelete.name}" de la biblioteca y de las rutinas donde aparezca. Esta acción no se puede deshacer.`}
          onConfirm={() => remove(exerciseToDelete.id)}
          onCancel={() => setExerciseToDelete(null)}
        />
      )}
      {exerciseToAdd && (
        <Modal title="Añadir a una rutina" onClose={() => setExerciseToAdd(null)}>
          <div className="space-y-4">
            <div className="rounded-2xl bg-petrol-50 p-4">
              <p className="text-sm font-semibold uppercase text-aqua">Ejercicio seleccionado</p>
              <h3 className="mt-1 text-xl font-bold text-petrol-700">{exerciseToAdd.name}</h3>
              <p className="mt-1 text-sm text-slate-600">Elige en qué rutina quieres programarlo. Añadirlo a una rutina no cambia la biblioteca.</p>
            </div>
            <div className="space-y-2">
              {state.routines.map((routine) => {
                const alreadyIncluded = routine.exercises.some((item) => item.exerciseId === exerciseToAdd.id);
                return (
                  <button
                    key={routine.id}
                    className={`animate-soft flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${alreadyIncluded ? 'border-petrol-100 bg-slate-50 text-slate-500' : 'border-app-border bg-white hover:border-petrol-100 hover:bg-petrol-50'}`}
                    onClick={() => addToRoutine(exerciseToAdd.id, routine.id)}
                  >
                    <span>
                      <span className="block font-bold text-petrol-700">{routine.name}</span>
                      <span className="block text-sm text-slate-600">{routine.exercises.length} ejercicios programados</span>
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${alreadyIncluded ? 'bg-white text-slate-500' : 'bg-aqua/15 text-petrol-700'}`}>{alreadyIncluded ? 'Ya incluido' : 'Añadir aquí'}</span>
                  </button>
                );
              })}
            </div>
            {routineMessage && <p className="rounded-xl bg-green-50 p-3 text-sm font-semibold text-calmgreen">{routineMessage}</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}
