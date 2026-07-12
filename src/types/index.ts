export type ExerciseCategory =
  | 'Activación lumbar'
  | 'Movilidad controlada'
  | 'Estabilidad'
  | 'Glúteos y piernas'
  | 'Banco y mancuernas'
  | 'Bandas elásticas'
  | 'Estiramientos'
  | 'Caminata y actividad suave'
  | 'Requiere autorización';

export type Difficulty = 'Suave' | 'Moderada' | 'Avanzada';
export type PhaseId = 'fase-1' | 'fase-2' | 'fase-3';
export type EquipmentKey =
  | 'bench'
  | 'dumbbells'
  | 'bands'
  | 'mat'
  | 'chair'
  | 'wall'
  | 'walkingSpace'
  | 'stationaryBike'
  | 'treadmill'
  | 'other';

export type EquipmentProfile = Record<EquipmentKey, boolean>;

export type ApprovalStatus = 'pending' | 'approved' | 'not-approved' | 'paused';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  description: string;
  position: string;
  instructions: string[];
  breathing: string;
  warnings: string[];
  commonErrors: string[];
  repetitions?: string;
  sets?: number;
  duration?: string;
  rest: string;
  workSeconds?: number;
  restSeconds?: number;
  plannedSets?: number;
  difficulty: Difficulty;
  phase: PhaseId;
  requiresProfessionalApproval: boolean;
  professionalApprovalRequired?: boolean;
  professionalApprovalConfirmed?: boolean;
  approvalStatus?: ApprovalStatus;
  approvalDate?: string;
  approvalNotes?: string;
  equipment?: EquipmentKey[];
  equipmentLabels?: string[];
  unavailableReason?: string;
  dumbbellWeightPerHand?: number;
  totalWeight?: number;
  weightMode?: 'none' | 'per-hand' | 'total';
  benchAngle?: string;
  objective?: string;
  muscles?: string[];
  benefits?: string[];
  executionTip?: string;
  supportPoints?: string[];
  avoidIf?: string[];
  progressionNotes?: string;
  illustrationStart: string;
  illustrationEnd: string;
  photoUrl?: string;
  enabled: boolean;
}

export interface RoutineExercise {
  exerciseId: string;
  order: number;
  sets?: number;
  repetitions?: string;
  duration?: string;
  rest: string;
  workSeconds?: number;
  restSeconds?: number;
  weightPerHand?: number;
  totalWeight?: number;
  approvalStatus?: ApprovalStatus;
  notes?: string;
  completed?: boolean;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  assignedDays: number[];
  exercises: RoutineExercise[];
  level: Difficulty;
  physiotherapistNotes: string;
}

export interface Session {
  id: string;
  date: string;
  routineId: string;
  durationMinutes: number;
  completedExerciseIds: string[];
  painBefore: number;
  painAfter: number;
  fatigue: number;
  stiffness?: number;
  sleepHours?: number;
  sleepQuality?: number;
  mood?: string;
  incidents?: string;
  walked: boolean;
  observations: string;
  savedAt?: string;
  exerciseLogs?: ExerciseSessionLog[];
  strengthLogs?: StrengthSessionLog[];
}

export interface ExerciseSessionLog {
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  setsPlanned: number;
  setsCompleted: number;
  workSeconds: number;
  restSeconds: number;
  repetitions?: string;
  duration?: string;
  completed: boolean;
  notes?: string;
}

export interface StrengthSessionLog {
  exerciseId: string;
  exerciseName: string;
  equipment: EquipmentKey[];
  weightMode: 'per-hand' | 'total';
  weightKg: number;
  setsCompleted: number;
  repetitions?: string;
  authorizedByUserOrProfessional: boolean;
}

export interface DailyCheckIn {
  date: string;
  feeling: string;
  pain: number;
  stiffness?: number;
  fatigue?: number;
  sleepHours?: number;
  sleepQuality?: number;
  mood?: string;
  recommendedRoutineId?: string;
}

export interface PainRecord {
  date: string;
  before: number;
  after: number;
}

export interface PatientProfile {
  name: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  heightCm?: number;
  weightKg?: number;

  surgeryType?: string;
  surgeryDate?: string;
  lumbarLevel?: string;
  hospital?: string;
  professionalName?: string;
  rehabilitationStartDate?: string;

  baselinePain: number;
  baselineStiffness: number;
  baselineFatigue: number;
  baselineMobility: 'very-limited' | 'limited' | 'moderate' | 'good';
  sleepHours?: number;
  sleepQuality?: number;

  medicalExerciseAuthorization: 'yes' | 'no' | 'unknown';
  hasProfessionalRoutine: boolean;

  goals: string[];
  dailyGoalMinutes: number;
  weeklyRehabDays: number;
  preferredSessionTime?: string;
  remindersEnabled: boolean;

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TrainingTab = 'recovery' | 'fitness' | 'stretching' | 'cardio' | 'movement-library' | 'favorites' | 'my-routines';

export type TrainingMuscleGroup =
  | 'Pecho'
  | 'Espalda'
  | 'Hombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Piernas'
  | 'Glúteos'
  | 'Core'
  | 'Movilidad'
  | 'Recuperación';

export type TrainingEquipment = 'Banco ajustable' | 'Mancuernas' | 'Bandas' | 'Peso corporal' | 'Esterilla' | 'Bicicleta estática' | 'Cinta de correr';

export interface TrainingExerciseImages {
  main: string;
  start: string;
  end: string;
}

export interface TrainingExercise {
  id: string;
  name: string;
  tab: Exclude<TrainingTab, 'favorites' | 'my-routines'>;
  muscleGroup: TrainingMuscleGroup;
  level: Difficulty;
  equipment: TrainingEquipment[];
  sets: string;
  repetitions: string;
  rest: string;
  images: TrainingExerciseImages;
  muscles: string[];
  description: string;
  benefits: string[];
  steps: string[];
  commonErrors: string[];
  breathing: string;
  recommendedWeight: string;
  progressions: string[];
  contraindications: string[];
  rehabPhase: PhaseId;
  isTherapeutic: boolean;
}

export interface TrainingRoutine {
  id: string;
  name: string;
  description?: string;
  exerciseIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TrainingCenterState {
  favorites: string[];
  routines: TrainingRoutine[];
}

export interface UserPreferences {
  onboarded: boolean;
  acceptedMedicalNotice: boolean;
  theme: 'light' | 'dark' | 'system';
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  soundEnabled: boolean;
  relaxingSoundEnabled: boolean;
  voiceGuidanceEnabled: boolean;
  vibrationEnabled: boolean;
  restMode: boolean;
  activePhase: PhaseId;
  patientName?: string;
  surgeryDate?: string;
  equipment: EquipmentProfile;
  autoBackupEnabled: boolean;
  lastAutoBackupAt?: string;
  syncReady?: boolean;
}

export interface RehabilitationPhase {
  id: PhaseId;
  name: string;
  description: string;
}

export interface AppState {
  exercises: Exercise[];
  routines: Routine[];
  sessions: Session[];
  checkIns: DailyCheckIn[];
  trainingCenter: TrainingCenterState;
  patientProfile?: PatientProfile;
  preferences: UserPreferences;
}
