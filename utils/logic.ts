
import { Activity, RankLevel, RankProgress, FellowshipClass, MedalDefinition, EarnedMedal } from '../types';

// --- Constants ---
export const COIN_VALUE_MAP: Record<string, number> = {
  '💲': 200,
  '💰': 1000,
  '🧈': 5000,
  '💎': 10000,
  '👑': 50000
};

export const COIN_EMOJIS = Object.keys(COIN_VALUE_MAP);

// --- Helpers ---
export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export const calculateActivityCalories = (activity: Activity): number => {
  // Prioritize explicit calories
  if (activity.calories) return activity.calories;
  if (activity.kilojoules) return activity.kilojoules / 4.184;
  
  // Estimate based on HR or time
  const hours = activity.moving_time / 3600;
  if (activity.average_heartrate) {
    return (190 / activity.average_heartrate) * hours * 700; // Rough estimate
  }
  
  // Fallback per sport
  const type = (activity.type || '').toLowerCase();
  if (type.includes('run')) return 700 * hours;
  if (type.includes('ride')) return 500 * hours;
  if (type.includes('swim')) return 600 * hours;
  return 400 * hours;
};

// --- Rank Logic ---
const BASE_HOURS = 100;
const RANK_GROUPS = [
  { name: 'Wood', emoji: '🪵', levels: 10 },
  { name: 'Metal', emoji: '⚙️', levels: 10 },
  { name: 'Bronze', emoji: '🥉', levels: 10 },
  { name: 'Silver', emoji: '🥈', levels: 10 },
  { name: 'Gold', emoji: '🥇', levels: 10 },
  { name: 'Platinum', emoji: '💎', levels: 10 },
  { name: 'Diamond', emoji: '💠', levels: 10 },
];

export const getRankConfig = (): RankLevel[] => {
  const levels: RankLevel[] = [];
  let currentMin = 0;
  
  RANK_GROUPS.forEach(group => {
    for (let i = 1; i <= group.levels; i++) {
      levels.push({
        name: `${group.name} ${i}`,
        emoji: group.emoji,
        minHours: currentMin,
        hoursPerLevel: BASE_HOURS
      });
      currentMin += BASE_HOURS;
    }
  });
  return levels;
};

export const calculateRankProgress = (totalHours: number): RankProgress => {
  const levels = getRankConfig();
  let currentRank = levels[0];
  let nextRank = levels[1] || null;
  
  for (let i = 0; i < levels.length; i++) {
    if (totalHours >= levels[i].minHours) {
      currentRank = levels[i];
      nextRank = levels[i + 1] || null;
    } else {
      break;
    }
  }

  // If max rank
  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      totalHours,
      progressPercent: 100,
      hoursNeeded: 0
    };
  }

  const hoursIntoLevel = totalHours - currentRank.minHours;
  const hoursNeeded = currentRank.hoursPerLevel - hoursIntoLevel;
  const progressPercent = (hoursIntoLevel / currentRank.hoursPerLevel) * 100;

  return {
    currentRank,
    nextRank,
    totalHours,
    progressPercent,
    hoursNeeded
  };
};

// --- Fellowship Class Logic ---
const FELLOWSHIP_CLASSES: FellowshipClass[] = [
  {
    id: 'cavaliere-di-rohan',
    name: 'Cavaliere di Rohan',
    crest: '🐎',
    focus: 'ride',
    description: 'Domina le pianure ventose con tirate lunghe, dislivelli robusti e cambi di ritmo da vero scudiero di Edoras.',
    reasons: []
  },
  {
    id: 'mitrillo-maratoneta',
    name: 'Mitrillo Maratoneta',
    crest: '💎',
    focus: 'run',
    description: 'Un corridore resistente come il mitril: chilometri macinati, passo brillante e finali lucenti in gara.',
    reasons: []
  },
  {
    id: 'custode-di-lorien',
    name: 'Custode di Lórien',
    crest: '🌿',
    focus: 'swim',
    description: 'Tra acque immacolate e respirazioni consapevoli mantieni l’equilibrio di ogni elfo della foresta dorata.',
    reasons: []
  },
  {
    id: 'fabbro-di-khazad-dum',
    name: 'Fabbro di Khazad-dûm',
    crest: '⛏️',
    focus: 'multi',
    description: 'Forgi potenza e resistenza con wattaggi solidi e salite degne delle miniere naniche.',
    reasons: []
  }
];

export const determineClass = (activities: Activity[]): FellowshipClass => {
  // Simplified logic for the React port -> Real logic would aggregate last 4 weeks stats
  const recent = activities.slice(0, 20);
  const runCount = recent.filter(a => a.type === 'Run').length;
  const rideCount = recent.filter(a => a.type === 'Ride').length;
  const swimCount = recent.filter(a => a.type === 'Swim').length;
  
  if (swimCount > 3) return FELLOWSHIP_CLASSES.find(c => c.id === 'custode-di-lorien')!;
  if (runCount > rideCount) return FELLOWSHIP_CLASSES.find(c => c.id === 'mitrillo-maratoneta')!;
  if (rideCount > runCount) return FELLOWSHIP_CLASSES.find(c => c.id === 'cavaliere-di-rohan')!;
  
  return FELLOWSHIP_CLASSES.find(c => c.id === 'fabbro-di-khazad-dum')!;
};

// --- Coin Logic ---
export const getActivityCoins = (activity: Activity): string[] => {
  const coins: string[] = [];
  const distKm = activity.distance / 1000;
  const elev = activity.total_elevation_gain;
  const cals = calculateActivityCalories(activity);
  const type = (activity.type || '').toLowerCase();

  if (type.includes('run')) {
    if (distKm >= 10) coins.push('💲');
    if (distKm >= 21) coins.push('💰');
    if (distKm >= 42) coins.push('💎');
  } else if (type.includes('ride')) {
    if (distKm >= 50) coins.push('💲');
    if (distKm >= 100) coins.push('💰');
    if (distKm >= 150) coins.push('🧈');
  }

  if (elev >= 1000) coins.push('💲');
  if (elev >= 2000) coins.push('💰');
  
  if (cals >= 1000) coins.push('💲');
  if (cals >= 2000) coins.push('💰');

  return coins;
};

// --- Medal Logic ---
export const MEDAL_DEFINITIONS: MedalDefinition[] = [
  { name: 'Run Duo', emoji: '👣', description: 'Run 2 days in a row', rarity: 'common', category: 'Consistency' },
  { name: 'Early Riser', emoji: '☀️', description: 'Activity before 6 AM', rarity: 'common', category: 'Lifestyle', criteria: (a) => new Date(a.start_date).getHours() < 6 },
  { name: 'Century Ride', emoji: '💯', description: 'Ride 100km', rarity: 'rare', category: 'Performance', criteria: (a) => a.type === 'Ride' && a.distance >= 100000 },
  { name: 'Everesting', emoji: '🏔️', description: 'Gain 8848m elevation', rarity: 'mythic', category: 'Performance', criteria: (a) => a.total_elevation_gain >= 8848 },
  { name: 'Marathoner', emoji: '🏃‍♀️', description: 'Run 42.2km', rarity: 'epic', category: 'Performance', criteria: (a) => a.type === 'Run' && a.distance >= 42195 },
  { name: 'Night Owl', emoji: '🦉', description: 'Activity after 9 PM', rarity: 'common', category: 'Lifestyle', criteria: (a) => new Date(a.start_date).getHours() >= 21 },
];

export const calculateEarnedMedals = (activities: Activity[]): EarnedMedal[] => {
  return MEDAL_DEFINITIONS.map(def => {
    let count = 0;
    activities.forEach(a => {
      if (def.criteria && def.criteria(a)) count++;
    });
    
    return {
      ...def,
      count,
      isEarned: count > 0,
      progress: count > 0 ? 100 : Math.floor(Math.random() * 90) // Mock progress for unearned
    };
  }).sort((a, b) => (b.isEarned ? 1 : 0) - (a.isEarned ? 1 : 0));
};
