import { initialAppState } from '../data/initialData';
import type { AppState } from '../types';

const KEY = 'mi-recuperacion-lumbar-state-v1';
const BACKUP_KEY = 'mi-recuperacion-lumbar-backup-latest';
const BACKUP_INTERVAL_MS = 1000 * 60 * 15;

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialAppState;
    return migrateState({ ...initialAppState, ...JSON.parse(raw) });
  } catch {
    return initialAppState;
  }
}

function migrateState(state: AppState): AppState {
  const exerciseDefaults = new Map(initialAppState.exercises.map((exercise) => [exercise.id, exercise]));
  const savedExercises = new Map(state.exercises.map((exercise) => [exercise.id, exercise]));
  const routineDefaults = new Map(initialAppState.routines.map((routine) => [routine.id, routine]));
  const savedRoutines = new Map(state.routines.map((routine) => [routine.id, routine]));
  const equipment = {
    ...initialAppState.preferences.equipment,
    ...state.preferences?.equipment,
  };
  const unavailableExerciseIds = new Set(initialAppState.exercises
    .filter((exercise) => exercise.equipment?.some((key) => !equipment[key]))
    .map((exercise) => exercise.id));
  const migratedDefaults: AppState['exercises'] = initialAppState.exercises.map((defaultExercise): AppState['exercises'][number] => {
    const exercise = savedExercises.get(defaultExercise.id) || defaultExercise;
    const defaults = exerciseDefaults.get(exercise.id);
    return {
      ...defaults,
      ...exercise,
      category: defaults?.category || exercise.category,
      equipment: exercise.equipment || defaults?.equipment || [],
      equipmentLabels: exercise.equipmentLabels || defaults?.equipmentLabels || ['Sin material'],
      unavailableReason: exercise.unavailableReason || defaults?.unavailableReason,
      professionalApprovalRequired: exercise.professionalApprovalRequired ?? defaults?.professionalApprovalRequired ?? exercise.requiresProfessionalApproval,
      professionalApprovalConfirmed: exercise.professionalApprovalConfirmed ?? defaults?.professionalApprovalConfirmed ?? false,
      approvalStatus: exercise.approvalStatus || defaults?.approvalStatus || (exercise.requiresProfessionalApproval ? 'pending' : 'approved'),
      photoUrl: exercise.photoUrl || defaults?.photoUrl,
      illustrationStart: exercise.illustrationStart || defaults?.illustrationStart || '',
      illustrationEnd: exercise.illustrationEnd || defaults?.illustrationEnd || '',
    };
  });
  const customExercises: AppState['exercises'] = state.exercises
    .filter((exercise) => !exerciseDefaults.has(exercise.id))
    .map((exercise) => ({
      ...exercise,
      equipment: exercise.equipment || [],
      equipmentLabels: exercise.equipmentLabels || ['Sin material'],
      professionalApprovalRequired: exercise.professionalApprovalRequired ?? exercise.requiresProfessionalApproval,
      professionalApprovalConfirmed: exercise.professionalApprovalConfirmed ?? false,
      approvalStatus: exercise.approvalStatus || (exercise.requiresProfessionalApproval ? 'pending' : 'approved'),
    }));
  const exercises: AppState['exercises'] = [
    ...migratedDefaults,
    ...customExercises,
  ];
  const routines = [
    ...initialAppState.routines.map((defaultRoutine) => ({
      ...defaultRoutine,
      ...savedRoutines.get(defaultRoutine.id),
      exercises: (savedRoutines.get(defaultRoutine.id)?.exercises || defaultRoutine.exercises).filter((exercise) => !unavailableExerciseIds.has(exercise.exerciseId)),
    })),
    ...state.routines
      .filter((routine) => !routineDefaults.has(routine.id))
      .map((routine) => ({
        ...routine,
        exercises: routine.exercises.filter((exercise) => !unavailableExerciseIds.has(exercise.exerciseId)),
      })),
  ];

  return {
    ...state,
    preferences: {
      ...initialAppState.preferences,
      ...state.preferences,
      equipment,
    },
    checkIns: (state.checkIns || []).map((checkIn) => ({
      stiffness: 0,
      fatigue: 0,
      sleepHours: 7,
      sleepQuality: 7,
      mood: checkIn.feeling,
      ...checkIn,
    })),
    routines,
    exercises,
  };
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
  if (!state.preferences.autoBackupEnabled) return;
  const now = new Date();
  const lastBackup = state.preferences.lastAutoBackupAt ? Date.parse(state.preferences.lastAutoBackupAt) : 0;
  if (Number.isNaN(lastBackup) || now.getTime() - lastBackup > BACKUP_INTERVAL_MS) {
    const backupState: AppState = {
      ...state,
      preferences: {
        ...state.preferences,
        lastAutoBackupAt: now.toISOString(),
      },
    };
    localStorage.setItem(BACKUP_KEY, JSON.stringify({ createdAt: now.toISOString(), state: backupState }));
    localStorage.setItem(KEY, JSON.stringify(backupState));
  }
}

export function exportState(state: AppState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mi-recuperacion-lumbar-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseImportedState(raw: string): AppState {
  const parsed = JSON.parse(raw) as Partial<AppState>;
  if (!parsed || !Array.isArray(parsed.exercises) || !Array.isArray(parsed.routines) || !Array.isArray(parsed.sessions) || !parsed.preferences) {
    throw new Error('El archivo no parece una copia válida de Mi Recuperación Lumbar.');
  }
  return migrateState({ ...initialAppState, ...parsed } as AppState);
}

export function getLatestBackup() {
  const raw = localStorage.getItem(BACKUP_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { createdAt: string; state: AppState };
  } catch {
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(KEY);
}
