export type RehabModuleId = 'lumbar' | 'knee' | 'cervical' | 'shoulder' | 'hip' | 'ankle';

export interface RehabModuleDefinition {
  id: RehabModuleId;
  name: string;
  enabled: boolean;
  description: string;
}

export const rehabModules: RehabModuleDefinition[] = [
  { id: 'lumbar', name: 'Lumbar', enabled: true, description: 'Recuperación lumbar tras artrodesis.' },
  { id: 'knee', name: 'Rodilla', enabled: false, description: 'Preparado para módulo futuro.' },
  { id: 'cervical', name: 'Cervical', enabled: false, description: 'Preparado para módulo futuro.' },
  { id: 'shoulder', name: 'Hombro', enabled: false, description: 'Preparado para módulo futuro.' },
  { id: 'hip', name: 'Cadera', enabled: false, description: 'Preparado para módulo futuro.' },
  { id: 'ankle', name: 'Tobillo', enabled: false, description: 'Preparado para módulo futuro.' },
];
