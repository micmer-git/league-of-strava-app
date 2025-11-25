
import React, { useState } from 'react';
import { Activity } from '../types';
import { Clock, MapPin, Flame, Zap } from 'lucide-react';
import { formatDuration } from '../utils/logic';

interface ActivityListProps {
  activities: Activity[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const [filter, setFilter] = useState<string>('All');

  const typeColors: Record<string, string> = {
    Ride: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    Run: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Swim: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Hike: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  };

  const filteredActivities = filter === 'All' 
    ? activities 
    : activities.filter(a => a.type === filter);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">Recent Activities</h2>
        <span className="text-xs text-slate-500 font-mono">{filteredActivities.length} entries</span>
      </header>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['All', 'Ride', 'Run', 'Swim', 'Hike'].map(type => (
          <button 
            key={type} 
            onClick={() => setFilter(type)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              filter === type
                ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <article key={activity.id} className="glass-panel group relative overflow-hidden rounded-2xl p-4 transition-all hover:border-slate-600 hover:bg-slate-800/80">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl ${typeColors[activity.type] || 'text-slate-400 border-slate-700 bg-slate-800'}`}>
                  {activity.type === 'Ride' ? '🚴' : activity.type === 'Run' ? '🏃' : activity.type === 'Swim' ? '🏊' : '🥾'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{activity.type}</h3>
                    <span className="text-xs text-slate-500">• {formatDate(activity.start_date)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatDuration(activity.moving_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={12} /> {Math.round(activity.computedCalories || 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-bold text-white">{(activity.distance / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-500">km</span></span>
                {activity.coins && activity.coins.length > 0 && (
                  <div className="flex gap-1 -mr-1">
                    {activity.coins.map((coin, i) => (
                      <span key={i} className="text-sm drop-shadow-md hover:scale-125 transition-transform cursor-default" title="Coin earned">{coin}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mini stats footer */}
            <div className="mt-4 flex items-center gap-4 border-t border-slate-700/50 pt-3">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-yellow-500" />
                <span className="text-xs font-medium text-slate-300">{(activity.distance / 100).toFixed(0)} Pts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-sky-500" />
                <span className="text-xs font-medium text-slate-300">{Math.round(activity.total_elevation_gain)}m</span>
              </div>
              {activity.kudos_count ? (
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-xs">👍</span>
                  <span className="text-xs font-medium text-slate-300">{activity.kudos_count}</span>
                </div>
              ) : null}
            </div>
          </article>
        ))}
        
        {filteredActivities.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No activities found for this category.
          </div>
        )}
      </div>
    </div>
  );
};
