

export interface Activity {
  id: string;
  external_id?: string;
  type: string; // 'Run' | 'Ride' | 'Swim', etc.
  sport_type?: string;
  start_date: string;
  distance: number; // meters
  total_elevation_gain: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  calories?: number;
  kilojoules?: number;
  average_heartrate?: number;
  suffer_score?: number;
  kudos_count?: number;
  map?: {
    summary_polyline?: string;
  };
  // Computed fields
  coins?: string[];
  computedCalories?: number;
}

export interface Athlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface RankLevel {
  name: string;
  emoji: string;
  minHours: number;
  hoursPerLevel: number;
}

export interface RankProgress {
  currentRank: RankLevel;
  nextRank: RankLevel | null;
  totalHours: number;
  progressPercent: number;
  hoursNeeded: number;
}

export interface FellowshipClass {
  id: string;
  name: string;
  crest: string;
  description: string;
  focus: string;
  reasons: string[];
}

export interface WalletData {
  totalValue: number;
  coins: Record<string, number>; // '💲': 10
  history: { date: string; value: number }[];
}

export interface MedalDefinition {
  name: string;
  emoji: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: string;
  criteria?: (activity: Activity) => boolean;
  dates?: string[];
}

export interface EarnedMedal extends MedalDefinition {
  count: number;
  isEarned: boolean;
  progress?: number;
  lastEarnedDate?: string;
}

export interface DashboardData {
  athlete: Athlete;
  activities: Activity[];
  totals: {
    hours: number;
    distance: number;
    elevation: number;
    calories: number;
  };
}