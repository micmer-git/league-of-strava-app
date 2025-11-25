
import { WalletData, Activity, EarnedMedal } from './types';

// Define a local interface for the specific mock profile structure
interface MockProfile {
  name: string;
  handle: string;
  avatar: string;
  className: string;
  classEmoji: string;
  classDescription: string;
  totalHours: number;
  weeklyHours: number;
  weeklyActivities: number;
  streakWeeks: number;
  rank: {
    name: string;
    emoji: string;
    minHours: number;
    maxHours: number;
  };
}

export const MOCK_PROFILE: MockProfile = {
  name: 'Elena Peregrina',
  handle: '@elenastrides',
  avatar: '🧝‍♀️',
  className: 'Cavaliere di Rohan',
  classEmoji: '🐎',
  classDescription: 'Domina le pianure ventose con tirate lunghe, dislivelli robusti e cambi di ritmo da vero scudiero di Edoras.',
  totalHours: 1285,
  weeklyHours: 12.4,
  weeklyActivities: 8,
  streakWeeks: 18,
  rank: {
    name: 'Bronze 8',
    emoji: '🥉',
    minHours: 1200,
    maxHours: 1300
  }
};

export const MOCK_WALLET: WalletData = {
  totalValue: 2450000, // $2.45M
  coins: {
    dollar: 142,
    moneybag: 45,
    butter: 12,
    diamond: 5,
    crown: 2
  },
  history: [
    { date: 'Jan', value: 1800000 },
    { date: 'Feb', value: 1950000 },
    { date: 'Mar', value: 2100000 },
    { date: 'Apr', value: 2250000 },
    { date: 'May', value: 2380000 },
    { date: 'Jun', value: 2450000 },
  ]
};

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'Ride',
    start_date: new Date().toISOString(),
    distance: 85400,
    total_elevation_gain: 1200,
    moving_time: 13500,
    elapsed_time: 13500,
    calories: 2100,
    coins: ['💰', '💲']
  },
  {
    id: '2',
    type: 'Run',
    start_date: new Date(Date.now() - 86400000).toISOString(),
    distance: 12500,
    total_elevation_gain: 150,
    moving_time: 3900,
    elapsed_time: 3900,
    calories: 850,
    coins: ['💲']
  },
  {
    id: '3',
    type: 'Swim',
    start_date: new Date(Date.now() - 172800000).toISOString(),
    distance: 2500,
    total_elevation_gain: 0,
    moving_time: 3300,
    elapsed_time: 3300,
    calories: 600,
    coins: []
  },
  {
    id: '4',
    type: 'Ride',
    start_date: new Date(Date.now() - 259200000).toISOString(),
    distance: 45000,
    total_elevation_gain: 450,
    moving_time: 6600,
    elapsed_time: 6600,
    calories: 1100,
    coins: ['💲']
  },
  {
    id: '5',
    type: 'Hike',
    start_date: new Date(Date.now() - 604800000).toISOString(),
    distance: 15000,
    total_elevation_gain: 800,
    moving_time: 15000,
    elapsed_time: 15000,
    calories: 1400,
    coins: ['🧈']
  }
];

export const MOCK_MEDALS: EarnedMedal[] = [
  { name: 'Run Duo', description: 'Two consecutive run days', emoji: '👣', isEarned: true, count: 12, rarity: 'common', category: 'Consistency' },
  { name: 'Early Riser', description: 'Activity before 6 AM', emoji: '☀️', isEarned: true, count: 5, rarity: 'common', category: 'Lifestyle' },
  { name: 'Century Ride', description: 'Ride 100km in one go', emoji: '💯', isEarned: true, count: 3, rarity: 'rare', category: 'Performance' },
  { name: 'Everesting', description: 'Gain 8848m elevation in a month', emoji: '🏔️', isEarned: true, count: 1, rarity: 'legendary', category: 'Performance' },
  { name: 'Marathoner', description: 'Run 42.2km', emoji: '🏃‍♀️', isEarned: false, progress: 85, count: 0, rarity: 'epic', category: 'Performance' },
  { name: 'Iron Will', description: 'Activity streak 30 days', emoji: '🔥', isEarned: false, progress: 60, count: 0, rarity: 'epic', category: 'Consistency' },
];