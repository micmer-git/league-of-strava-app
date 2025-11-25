
import { DashboardData, Activity } from '../types';
import { determineClass, getActivityCoins, calculateActivityCalories } from '../utils/logic';

// Use the mock data as fallback if the API fails (which it will in this preview)
const MOCK_ACTIVITIES_RAW: Partial<Activity>[] = [
  { id: '101', type: 'Ride', start_date: new Date().toISOString(), distance: 85400, total_elevation_gain: 1200, moving_time: 13500, kudos_count: 12 },
  { id: '102', type: 'Run', start_date: new Date(Date.now() - 86400000).toISOString(), distance: 12500, total_elevation_gain: 150, moving_time: 3900, kudos_count: 5 },
  { id: '103', type: 'Swim', start_date: new Date(Date.now() - 172800000).toISOString(), distance: 2500, total_elevation_gain: 0, moving_time: 3300, kudos_count: 8 },
  { id: '104', type: 'Ride', start_date: new Date(Date.now() - 259200000).toISOString(), distance: 45000, total_elevation_gain: 450, moving_time: 6600, kudos_count: 2 },
  { id: '105', type: 'Hike', start_date: new Date(Date.now() - 604800000).toISOString(), distance: 15000, total_elevation_gain: 800, moving_time: 15000, kudos_count: 20 },
  // Add more historical data to make charts look good
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `hist-${i}`,
    type: Math.random() > 0.5 ? 'Ride' : 'Run',
    start_date: new Date(Date.now() - (i + 5) * 86400000).toISOString(),
    distance: Math.random() * 20000 + 5000,
    total_elevation_gain: Math.random() * 500,
    moving_time: Math.random() * 3600 + 1800,
    kudos_count: Math.floor(Math.random() * 10)
  }))
];

// Process raw mock data into full Activity objects with computed stats
const processMockActivities = (): Activity[] => {
  return MOCK_ACTIVITIES_RAW.map(a => {
    const fullActivity = a as Activity;
    fullActivity.computedCalories = calculateActivityCalories(fullActivity);
    fullActivity.coins = getActivityCoins(fullActivity);
    return fullActivity;
  });
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Attempt to fetch from the backend we assume exists based on prompt
    const response = await fetch('/api/strava-data');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (e) {
    console.log('Falling back to mock data');
    const activities = processMockActivities();
    const totalTime = activities.reduce((sum, a) => sum + a.moving_time, 0);
    
    return {
      athlete: {
        id: 123,
        firstname: 'Elena',
        lastname: 'Peregrina',
        profile: 'https://ui-avatars.com/api/?name=Elena+Peregrina&background=random',
        city: 'Torino',
        country: 'Italy'
      },
      activities,
      totals: {
        hours: totalTime / 3600,
        distance: activities.reduce((sum, a) => sum + a.distance, 0),
        elevation: activities.reduce((sum, a) => sum + a.total_elevation_gain, 0),
        calories: activities.reduce((sum, a) => sum + (a.computedCalories || 0), 0)
      }
    };
  }
};

export const initiateStravaAuth = () => {
  // Redirect to the auth endpoint defined in the backend server.js
  window.location.href = '/auth/strava';
};
