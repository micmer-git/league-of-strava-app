
import React from 'react';
import { Athlete, RankProgress, FellowshipClass } from '../types';
import { Info } from 'lucide-react';

interface ProfileViewProps {
  athlete: Athlete;
  rankProgress: RankProgress;
  fellowshipClass: FellowshipClass;
  totals: {
    hours: number;
    distance: number;
    elevation: number;
  };
}

export const ProfileView: React.FC<ProfileViewProps> = ({ athlete, rankProgress, fellowshipClass, totals }) => {
  // Calculate Earth circumferences (40,075 km) and Everest summits (8,848 m)
  const worldTrips = (totals.distance / 1000 / 40075).toFixed(2);
  const everests = (totals.elevation / 8848).toFixed(1);

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Card */}
      <section className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl"></div>

        <header className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-sky-600/5 border border-sky-500/30 overflow-hidden shadow-lg shadow-sky-500/10">
              {athlete.profile ? (
                <img src={athlete.profile} alt={athlete.firstname} className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl">🧙‍♂️</span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">@{athlete.firstname}{athlete.lastname}</p>
              <h2 className="text-2xl font-heading font-bold text-white">{athlete.firstname} {athlete.lastname}</h2>
              <p className="text-sm text-slate-400">{athlete.city || 'Middle Earth'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Class</span>
             <div className="flex items-center gap-2 text-sky-400 font-semibold">
               <span className="text-xl">{fellowshipClass.crest}</span>
               <span className="hidden sm:inline">{fellowshipClass.name}</span>
             </div>
          </div>
        </header>

        <div className="relative z-10 mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            {fellowshipClass.focus === 'multi' ? 'Multi-sport' : fellowshipClass.focus}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            Total Hrs: {totals.hours.toFixed(0)}
          </span>
        </div>

        <div className="relative z-10 mt-6 rounded-xl bg-slate-800/30 p-4 border border-slate-700/30">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{fellowshipClass.crest}</span>
            <div>
              <h4 className="font-bold text-sky-100 text-sm mb-1">{fellowshipClass.name}</h4>
              <p className="text-sm leading-relaxed text-slate-300 italic">
                "{fellowshipClass.description}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rank Section */}
      <section className="glass-panel rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-white">Training Rank</h3>
            <p className="text-sm text-slate-400">{rankProgress.currentRank.name}</p>
          </div>
          <div className="text-4xl drop-shadow-md">{rankProgress.currentRank.emoji}</div>
        </div>

        <div className="mb-2 flex justify-between text-xs font-medium text-slate-400">
          <span>{Math.floor(rankProgress.totalHours)}h total</span>
          <span>{rankProgress.nextRank ? `Next: ${rankProgress.nextRank.minHours}h` : 'Max Level'}</span>
        </div>
        
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-800 shadow-inner border border-slate-700">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 via-sky-500 to-blue-600 transition-all duration-1000 ease-out"
            style={{ width: `${rankProgress.progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
           <p className="text-xs text-green-400 flex items-center gap-1">
             <span className="h-2 w-2 rounded-full bg-green-500"></span>
             {rankProgress.nextRank ? `${Math.ceil(rankProgress.hoursNeeded)}h to ${rankProgress.nextRank.name}` : 'Legendary Status'}
           </p>
           <button className="flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">
             Map the ladder <Info size={14} />
           </button>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4">
          <div className="text-3xl mb-2">🌍</div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">World Trips</p>
          <p className="text-2xl font-bold text-white">{worldTrips}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <div className="text-3xl mb-2">🏔️</div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Everests</p>
          <p className="text-2xl font-bold text-white">{everests}</p>
        </div>
      </div>
    </div>
  );
};
