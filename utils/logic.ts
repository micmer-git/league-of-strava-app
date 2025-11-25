
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
  if (activity.calories) return activity.calories;
  if (activity.kilojoules) return activity.kilojoules / 4.184;
  
  const hours = activity.moving_time / 3600;
  if (activity.average_heartrate) {
    return (190 / activity.average_heartrate) * hours * 700; 
  }
  
  const type = (activity.type || '').toLowerCase();
  if (type.includes('run')) return 700 * hours;
  if (type.includes('ride')) return 500 * hours;
  if (type.includes('swim')) return 600 * hours;
  return 400 * hours;
};

// --- Rank Logic ---
const BASE_HOURS_PER_LEVEL = 100;
const RANK_GROUPS = [
  { name: 'Wood', emoji: '🪵', levels: 10 },
  { name: 'Metal', emoji: '⚙️', levels: 10 },
  { name: 'Bronze', emoji: '🥉', levels: 10 },
  { name: 'Silver', emoji: '🥈', levels: 10 },
  { name: 'Gold', emoji: '🥇', levels: 10 },
  { name: 'Platinum', emoji: '💎', levels: 10 },
  { name: 'Diamond', emoji: '💠', levels: 10 },
  { name: 'Master', emoji: '👑', levels: 100 }, // Infinite scaling
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
        hoursPerLevel: BASE_HOURS_PER_LEVEL
      });
      currentMin += BASE_HOURS_PER_LEVEL;
    }
  });
  return levels;
};

export const calculateRankProgress = (totalHours: number): RankProgress => {
  const levels = getRankConfig();
  let currentRank = levels[0];
  let nextRank = levels[1] || null;
  let currentIndex = 0;
  
  for (let i = 0; i < levels.length; i++) {
    if (totalHours >= levels[i].minHours) {
      currentRank = levels[i];
      nextRank = levels[i + 1] || null;
      currentIndex = i;
    } else {
      break;
    }
  }

  const hoursIntoLevel = totalHours - currentRank.minHours;
  const hoursNeeded = currentRank.hoursPerLevel - hoursIntoLevel;
  const progressPercent = Math.min(100, Math.max(0, (hoursIntoLevel / currentRank.hoursPerLevel) * 100));

  return {
    currentRank,
    nextRank,
    totalHours,
    progressPercent,
    hoursNeeded,
    levelLabel: `Level ${currentIndex + 1}`
  };
};

// --- Fellowship Class Logic ---
interface ClassCriterion {
  metric: keyof Activity | 'weeklyHours' | 'weeklyActivities' | 'runKm' | 'rideKm' | 'swimKm' | 'elevationGain' | 'multiSportDays';
  min?: number;
  max?: number;
  weight: number;
  description: string;
}

interface ExtendedFellowshipClass extends FellowshipClass {
  criteria: ClassCriterion[];
}

const FELLOWSHIP_CLASSES: ExtendedFellowshipClass[] = [
  {
    id: 'cavaliere-di-rohan',
    name: 'Cavaliere di Rohan',
    crest: '🐎',
    focus: 'ride',
    description: 'Domina le pianure ventose con tirate lunghe, dislivelli robusti e cambi di ritmo da vero scudiero di Edoras.',
    baseScore: 0.8,
    reasons: [],
    criteria: [
      { metric: 'rideKm', min: 150, weight: 3, description: 'Over 150km riding per week' },
      { metric: 'weeklyHours', min: 10, weight: 1.5, description: '10+ hours training/week' },
      { metric: 'elevationGain', min: 1800, weight: 1.5, description: '1,800m+ weekly elevation' },
    ],
  },
  {
    id: 'mitrillo-maratoneta',
    name: 'Mitrillo Maratoneta',
    crest: '💎',
    focus: 'run',
    description: 'Un corridore resistente come il mitril: chilometri macinati, passo brillante e finali lucenti in gara.',
    baseScore: 0.6,
    reasons: [],
    criteria: [
      { metric: 'runKm', min: 50, weight: 2.5, description: 'High weekly running volume (>50km)' },
      { metric: 'weeklyActivities', min: 5, weight: 1.4, description: 'Consistent daily runner' },
    ],
  },
  {
    id: 'custode-di-lorien',
    name: 'Custode di Lórien',
    crest: '🌿',
    focus: 'swim',
    description: 'Tra acque immacolate e respirazioni consapevoli mantieni l’equilibrio di ogni elfo della foresta dorata.',
    baseScore: 0.5,
    reasons: [],
    criteria: [
      { metric: 'swimKm', min: 4, weight: 2.2, description: 'Significant swim distance (>4km/week)' },
      { metric: 'weeklyHours', min: 6, weight: 0.8, description: 'Consistent training hours' },
    ],
  },
  {
    id: 'fabbro-di-khazad-dum',
    name: 'Fabbro di Khazad-dûm',
    crest: '⛏️',
    focus: 'multi',
    description: 'Forgi potenza e resistenza con wattaggi solidi e salite degne delle miniere naniche.',
    baseScore: 0.5,
    reasons: [],
    criteria: [
      { metric: 'elevationGain', min: 2000, weight: 1.8, description: 'Massive elevation gain (>2000m/week)' },
      { metric: 'weeklyHours', min: 11, weight: 1.1, description: 'High volume training week' },
    ],
  },
  {
    id: 'passolungo-della-contea',
    name: 'Passolungo della Contea',
    crest: '🥾',
    focus: 'run',
    description: 'Costanza da hobbit e passi sempre pronti per nuove strade sterrate.',
    baseScore: 0.4,
    reasons: [],
    criteria: [
      { metric: 'weeklyActivities', min: 4, weight: 1.0, description: 'Consistent activity frequency' },
    ],
  },
  {
    id: 'tempesta-di-silmaril',
    name: 'Tempesta di Silmaril',
    crest: '💠',
    focus: 'multi',
    description: 'Raccogli ogni luce delle Silmaril: disciplina totale e brillantezza in gara.',
    baseScore: 0.7,
    reasons: [],
    criteria: [
      { metric: 'weeklyHours', min: 13, weight: 2.1, description: 'Elite volume (>13h/week)' },
      { metric: 'multiSportDays', min: 3, weight: 1.5, description: 'Frequent multi-sport days' },
    ],
  }
];

export const determineClass = (activities: Activity[]): FellowshipClass => {
  if (!activities.length) return FELLOWSHIP_CLASSES[4]; // Default to Hobbit

  // 1. Aggregate stats for the "current week" (last 7 days of data)
  // In a real scenario, we'd filter by date. For mock/static data, we'll take the whole set averaged or summed as proxy.
  const totals = {
    runKm: 0,
    rideKm: 0,
    swimKm: 0,
    weeklyHours: 0,
    weeklyActivities: activities.length,
    elevationGain: 0,
    multiSportDays: 0
  };

  // Simple aggregation for demonstration
  const dates = new Set<string>();
  const sportsPerDate = new Map<string, Set<string>>();

  activities.forEach(a => {
    const km = a.distance / 1000;
    const type = (a.type || '').toLowerCase();
    const date = a.start_date.split('T')[0];
    
    dates.add(date);
    if (!sportsPerDate.has(date)) sportsPerDate.set(date, new Set());
    sportsPerDate.get(date)?.add(type);

    if (type.includes('run')) totals.runKm += km;
    if (type.includes('ride')) totals.rideKm += km;
    if (type.includes('swim')) totals.swimKm += km;
    
    totals.weeklyHours += (a.moving_time / 3600);
    totals.elevationGain += a.total_elevation_gain;
  });

  // Calculate multi-sport days
  sportsPerDate.forEach(types => {
    if (types.size > 1) totals.multiSportDays++;
  });

  // Normalize to "weekly" average if data spans multiple weeks
  const uniqueDays = dates.size || 1;
  const weeks = Math.max(1, uniqueDays / 7);
  
  const weeklyStats = {
    runKm: totals.runKm / weeks,
    rideKm: totals.rideKm / weeks,
    swimKm: totals.swimKm / weeks,
    weeklyHours: totals.weeklyHours / weeks,
    weeklyActivities: totals.weeklyActivities / weeks,
    elevationGain: totals.elevationGain / weeks,
    multiSportDays: totals.multiSportDays / weeks
  };

  // 2. Score each class
  let bestClass = FELLOWSHIP_CLASSES[0];
  let maxScore = -Infinity;

  const scoredClasses = FELLOWSHIP_CLASSES.map(cls => {
    let score = cls.baseScore;
    const satisfiedReasons: string[] = [];

    cls.criteria.forEach(crit => {
      const val = weeklyStats[crit.metric as keyof typeof weeklyStats] || 0;
      if (val >= (crit.min || 0)) {
        score += crit.weight;
        satisfiedReasons.push(crit.description);
      }
    });

    // Bonus for focus match
    if (cls.focus === 'run' && weeklyStats.runKm > weeklyStats.rideKm) score += 0.5;
    if (cls.focus === 'ride' && weeklyStats.rideKm > weeklyStats.runKm) score += 0.5;

    return { ...cls, score, reasons: satisfiedReasons };
  });

  scoredClasses.forEach(c => {
    if (c.score > maxScore) {
      maxScore = c.score;
      bestClass = c;
    }
  });

  return bestClass;
};

// --- Coin Logic ---
export const getActivityCoins = (activity: Activity): string[] => {
  const coins: string[] = [];
  const distKm = activity.distance / 1000;
  const elev = activity.total_elevation_gain;
  const cals = calculateActivityCalories(activity);
  const type = (activity.type || '').toLowerCase();

  // Run Thresholds
  if (type.includes('run')) {
    if (distKm >= 10) coins.push('💲'); // 10km
    if (distKm >= 21) coins.push('💰'); // Half Marathon
    if (distKm >= 42) coins.push('💎'); // Marathon
    if (distKm >= 60) coins.push('👑'); // Ultra
  } 
  // Ride Thresholds
  else if (type.includes('ride')) {
    if (distKm >= 50) coins.push('💲');
    if (distKm >= 100) coins.push('💰');
    if (distKm >= 150) coins.push('🧈');
    if (distKm >= 200) coins.push('💎');
  }
  // Swim Thresholds
  else if (type.includes('swim')) {
    if (distKm >= 2) coins.push('💲');
    if (distKm >= 4) coins.push('💰');
  }

  // Universal Thresholds
  if (elev >= 1000) coins.push('💲');
  if (elev >= 2000) coins.push('💰');
  if (elev >= 4000) coins.push('💎');
  
  if (cals >= 1000) coins.push('💲');
  if (cals >= 2500) coins.push('💰');
  if (cals >= 4000) coins.push('🧈');

  return coins;
};

// --- Medal Logic ---
export const MEDAL_DEFINITIONS: MedalDefinition[] = [
  { name: 'Run Duo', emoji: '👣', description: 'Run 2 days in a row', rarity: 'common', category: 'Consistency' },
  { name: 'Early Riser', emoji: '🌅', description: 'Activity before 6 AM', rarity: 'common', category: 'Lifestyle', criteria: (a) => new Date(a.start_date).getHours() < 6 },
  { name: 'Century Ride', emoji: '💯', description: 'Ride 100km', rarity: 'rare', category: 'Performance', criteria: (a) => a.type === 'Ride' && a.distance >= 100000 },
  { name: 'Everesting', emoji: '🏔️', description: 'Gain 8848m elevation', rarity: 'mythic', category: 'Performance', criteria: (a) => a.total_elevation_gain >= 8848 },
  { name: 'Marathoner', emoji: '🏃‍♀️', description: 'Run 42.2km', rarity: 'epic', category: 'Performance', criteria: (a) => a.type === 'Run' && a.distance >= 42195 },
  { name: 'Night Owl', emoji: '🦉', description: 'Activity after 9 PM', rarity: 'common', category: 'Lifestyle', criteria: (a) => new Date(a.start_date).getHours() >= 21 },
  { name: 'Half Century', emoji: '🚴', description: 'Ride 50km', rarity: 'common', category: 'Performance', criteria: (a) => a.type === 'Ride' && a.distance >= 50000 },
  { name: 'Climber', emoji: '🧗', description: 'Gain 1000m elevation', rarity: 'rare', category: 'Performance', criteria: (a) => a.total_elevation_gain >= 1000 },
  { name: 'Burner', emoji: '🔥', description: 'Burn 1500+ calories', rarity: 'rare', category: 'Fitness', criteria: (a) => calculateActivityCalories(a) >= 1500 },
  { name: 'Weekend Warrior', emoji: '⚔️', description: 'Long activity on weekend', rarity: 'common', category: 'Lifestyle', criteria: (a) => {
    const d = new Date(a.start_date).getDay();
    return (d === 0 || d === 6) && a.moving_time > 7200;
  }},
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
