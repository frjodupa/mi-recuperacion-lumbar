import type { Difficulty, PhaseId, TrainingEquipment, TrainingExercise, TrainingMuscleGroup, TrainingTab } from '../types';

type CatalogSeed = {
  group: TrainingMuscleGroup;
  count: number;
  tab: TrainingExercise['tab'];
  equipment: TrainingEquipment[];
  image: string;
  names: string[];
  phase: PhaseId;
  level: Difficulty;
};

const photo = (file: string) => `/exercise-photos/${file}`;

const seeds: CatalogSeed[] = [
  { group: 'Pecho', count: 10, tab: 'fitness', equipment: ['Banco ajustable', 'Mancuernas'], image: 'light-weights-setup.jpg', phase: 'fase-3', level: 'Moderada', names: ['Press inclinado con mancuernas', 'Press plano controlado', 'Aperturas ligeras en banco', 'Press neutro con mancuernas', 'Pullover corto asistido'] },
  { group: 'Espalda', count: 12, tab: 'fitness', equipment: ['Bandas', 'Banco ajustable'], image: 'seated-band-row.jpg', phase: 'fase-2', level: 'Suave', names: ['Remo sentado con banda', 'Remo apoyado en banco', 'Jalón con banda', 'Retracción escapular', 'Remo unilateral apoyado'] },
  { group: 'Hombros', count: 10, tab: 'fitness', equipment: ['Mancuernas', 'Bandas'], image: 'light-weights-setup.jpg', phase: 'fase-3', level: 'Moderada', names: ['Elevación lateral ligera', 'Press sentado neutro', 'Rotación externa con banda', 'Elevación frontal alterna', 'Y apoyada en banco'] },
  { group: 'Bíceps', count: 8, tab: 'fitness', equipment: ['Mancuernas', 'Bandas'], image: 'seated-dumbbell-curl.jpg', phase: 'fase-2', level: 'Suave', names: ['Curl sentado con mancuernas', 'Curl martillo sentado', 'Curl con banda', 'Curl alterno apoyado'] },
  { group: 'Tríceps', count: 8, tab: 'fitness', equipment: ['Bandas', 'Mancuernas'], image: 'light-weights-setup.jpg', phase: 'fase-3', level: 'Moderada', names: ['Extensión de tríceps con banda', 'Press cerrado ligero', 'Patada de tríceps apoyada', 'Extensión sentado ligera'] },
  { group: 'Piernas', count: 15, tab: 'fitness', equipment: ['Banco ajustable', 'Mancuernas', 'Peso corporal'], image: 'sit-to-stand.jpg', phase: 'fase-2', level: 'Suave', names: ['Sentarse y levantarse', 'Step-up bajo asistido', 'Extensión de rodilla en banco', 'Peso muerto parcial con mancuernas', 'Elevación de talones'] },
  { group: 'Glúteos', count: 12, tab: 'fitness', equipment: ['Bandas', 'Esterilla', 'Banco ajustable'], image: 'glute-bridge.jpg', phase: 'fase-2', level: 'Suave', names: ['Puente de glúteo', 'Abducción lateral con banda', 'Hip thrust corto en banco', 'Clamshell con banda', 'Extensión de cadera apoyada'] },
  { group: 'Core', count: 15, tab: 'fitness', equipment: ['Esterilla', 'Bandas', 'Peso corporal'], image: 'pelvic-tilt-core.jpg', phase: 'fase-1', level: 'Suave', names: ['Dead bug básico', 'Pallof press con banda', 'Plancha inclinada', 'Marcha abdominal controlada', 'Bird dog reducido'] },
  { group: 'Movilidad', count: 20, tab: 'movement-library', equipment: ['Esterilla', 'Peso corporal'], image: 'cat-camel.jpg', phase: 'fase-1', level: 'Suave', names: ['Cat camel suave', 'Movilidad torácica sentado', 'Basculación pélvica', 'Rotación lumbar mínima', 'Respiración costal'] },
  { group: 'Recuperación', count: 20, tab: 'recovery', equipment: ['Esterilla', 'Peso corporal'], image: 'diaphragmatic-breathing.jpg', phase: 'fase-1', level: 'Suave', names: ['Respiración diafragmática', 'Activación transverso abdominal', 'Descarga en banco', 'Caminata suave', 'Relajación lumbar guiada'] },
];

export const trainingTabs: { id: TrainingTab; label: string; description: string }[] = [
  { id: 'recovery', label: 'Recuperación', description: 'Ejercicios terapéuticos y seguros.' },
  { id: 'fitness', label: 'Fitness', description: 'Banco, mancuernas, bandas y peso corporal.' },
  { id: 'stretching', label: 'Estiramientos', description: 'Movilidad y flexibilidad progresiva.' },
  { id: 'cardio', label: 'Cardio', description: 'Actividad cardiovascular suave.' },
  { id: 'movement-library', label: 'Biblioteca de movimientos', description: 'Patrones técnicos y educativos.' },
  { id: 'favorites', label: 'Favoritos', description: 'Tus movimientos guardados.' },
  { id: 'my-routines', label: 'Mis rutinas', description: 'Rutinas de entrenamiento creadas por ti.' },
];

export const fitnessFilters: ('Todos' | TrainingMuscleGroup)[] = ['Todos', 'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Piernas', 'Glúteos', 'Core', 'Movilidad', 'Recuperación'];

export const plannedTrainingCatalog = seeds.map(({ group, count }) => ({ group, count }));

export const trainingCatalog: TrainingExercise[] = seeds.flatMap((seed) => (
  Array.from({ length: seed.count }, (_, index) => createExercise(seed, index + 1))
));

function createExercise(seed: CatalogSeed, index: number): TrainingExercise {
  const baseName = seed.names[(index - 1) % seed.names.length];
  const name = index <= seed.names.length ? baseName : `${baseName} ${Math.ceil(index / seed.names.length)}`;
  const id = `${slug(seed.group)}-${String(index).padStart(2, '0')}`;
  const image = photo(seed.image);
  const isRecovery = seed.group === 'Recuperación' || seed.group === 'Movilidad';

  return {
    id,
    name,
    tab: seed.tab,
    muscleGroup: seed.group,
    level: seed.level,
    equipment: seed.equipment,
    sets: isRecovery ? '1-2' : '2-3',
    repetitions: isRecovery ? '8-10 respiraciones o repeticiones' : '8-12 repeticiones',
    rest: isRecovery ? '30-45 s' : '60-90 s',
    images: {
      main: image,
      start: image,
      end: image,
    },
    muscles: inferMuscles(seed.group),
    description: `Movimiento preparado para el grupo ${seed.group.toLowerCase()}, con ejecución controlada y progresión prudente.`,
    benefits: ['Mejora la tolerancia al movimiento', 'Refuerza control postural', 'Permite progresar sin prisas ni compensaciones'],
    steps: ['Colócate en una posición estable.', 'Mantén respiración fluida y abdomen activo.', 'Realiza el movimiento lento y sin dolor.', 'Vuelve a la posición inicial con control.'],
    commonErrors: ['Acelerar la repetición', 'Compensar con la zona lumbar', 'Usar una carga excesiva', 'Contener la respiración'],
    breathing: 'Inspira antes de iniciar y espira durante el esfuerzo, sin bloquear el aire.',
    recommendedWeight: isRecovery ? 'Sin carga externa' : 'Carga ligera que permita terminar todas las repeticiones con técnica limpia.',
    progressions: ['Aumentar repeticiones antes que peso', 'Añadir una serie si la tolerancia es buena', 'Incrementar carga solo con autorización cuando proceda'],
    contraindications: ['Dolor agudo', 'Síntomas neurológicos nuevos', 'Pérdida de fuerza', 'Indicación médica de reposo o limitación'],
    rehabPhase: seed.phase,
    isTherapeutic: isRecovery || seed.phase === 'fase-1',
  };
}

function inferMuscles(group: TrainingMuscleGroup) {
  const map: Record<TrainingMuscleGroup, string[]> = {
    Pecho: ['Pectoral mayor', 'Deltoides anterior', 'Tríceps'],
    Espalda: ['Dorsal ancho', 'Romboides', 'Trapecio medio', 'Core estabilizador'],
    Hombros: ['Deltoides', 'Manguito rotador', 'Serrato anterior'],
    Bíceps: ['Bíceps braquial', 'Braquial', 'Antebrazo'],
    Tríceps: ['Tríceps braquial', 'Estabilizadores escapulares'],
    Piernas: ['Cuádriceps', 'Isquiotibiales', 'Gemelos', 'Core'],
    Glúteos: ['Glúteo mayor', 'Glúteo medio', 'Rotadores de cadera'],
    Core: ['Transverso abdominal', 'Oblicuos', 'Multífidos', 'Diafragma'],
    Movilidad: ['Columna torácica', 'Pelvis', 'Cadera', 'Respiración'],
    Recuperación: ['Diafragma', 'Transverso abdominal', 'Suelo pélvico', 'Musculatura profunda'],
  };
  return map[group];
}

function slug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
