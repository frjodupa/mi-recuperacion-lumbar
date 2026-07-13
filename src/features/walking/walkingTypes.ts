export type WalkingLocation = 'outdoor' | 'treadmill';

export type WalkingGoalType = 'time' | 'distance' | 'free';

export type WalkingFeelingBefore =
  | 'very-good'
  | 'good'
  | 'normal'
  | 'mild-discomfort'
  | 'difficult-day';

export type WalkingFeelingAfter = 'better' | 'same' | 'worse';

export type WalkingSessionStatus =
  | 'planned'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface WalkingPlan {
  location: WalkingLocation;
  goalType: WalkingGoalType;

  targetMinutes?: number;
  targetDistanceMeters?: number;

  feelingBefore: WalkingFeelingBefore;

  treadmillSpeedKmh?: number;
  treadmillInclinePercent?: number;

  notes?: string;
}

export interface WalkingSession {
  id: string;
  startedAt: string;
  finishedAt?: string;

  status: WalkingSessionStatus;
  plan: WalkingPlan;

  elapsedSeconds: number;
  distanceMeters?: number;
  steps?: number;

  feelingAfter?: WalkingFeelingAfter;
  painBefore?: number;
  painAfter?: number;

  incidents?: string;
  observations?: string;

  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_WALKING_PLAN: WalkingPlan = {
  location: 'outdoor',
  goalType: 'time',
  targetMinutes: 15,
  targetDistanceMeters: 1000,
  feelingBefore: 'normal',
  treadmillSpeedKmh: 3,
  treadmillInclinePercent: 0,
};