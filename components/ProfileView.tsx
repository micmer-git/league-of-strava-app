
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

        <header className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-4">
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
          <div className="flex flex-col items-start sm:items-end">
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Class</span>
             <div className="flex items-center gap-2 text-sky-400 font-semibold">
               <span className="text-2xl filter drop-shadow-md">{fellowshipClass.crest}</span>
               <span className="text-lg">{fellowshipClass.name}</span>
             </div>
          </div>
        </header>

        <div className="relative z-10 mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            {fellowshipClass.focus === 'multi' ? 'Multi-sport' : fellowshipClass.focus}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            {Math.floor(totals.hours)} Hours
          </span>
        </div>

        <div className="relative z-10 mt-6 rounded-xl bg-slate-800/30 p-4 border border-slate-700/30 backdrop-blur-sm">
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-slate-300 italic border-l-2 border-sky-500/50 pl-3">
              "{fellowshipClass.description}"
            </p>
            {fellowshipClass.reasons.length > 0 && (
              <ul className="mt-2 space-y-1">
                {fellowshipClass.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-sky-400/80">
                    <span className="h-1 w-1 rounded-full bg-sky-400"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Rank Section */}
      <section className="glass-panel rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-heading font-bold text-white">Training Rank</h3>
              <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                {rankProgress.levelLabel}
              </span>
            </div>
            <p className="text-sm text-sky-400 font-medium">{rankProgress.currentRank.name}</p>
          </div>
          <div className="text-5xl filter drop-shadow-lg transform hover:scale-110 transition-transform duration-300 cursor-help" title={`Rank: ${rankProgress.currentRank.name}`}>
            {rankProgress.currentRank.emoji}
          </div>
        </div>

        <div className="mb-2 flex justify-between text-xs font-medium text-slate-400">
          <span>{Math.floor(rankProgress.totalHours)}h logged</span>
          <span>{rankProgress.nextRank ? `Next: ${rankProgress.nextRank.minHours}h` : 'Max Level'}</span>
        </div>
        
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-900 shadow-inner border border-slate-700/50">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 via-sky-500 to-blue-600 transition-all duration-1000 ease-out"
            style={{ width: `${rankProgress.progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
           <p className="text-xs text-slate-400 flex items-center gap-1.5">
             {rankProgress.nextRank ? (
               <>
                 <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
                 <span>{Math.ceil(rankProgress.hoursNeeded)}h needed for <span className="text-white font-bold">{rankProgress.nextRank.name}</span></span>
               </>
             ) : (
               <span className="text-amber-400 font-bold">Legendary Status Achieved</span>
             )}
           </p>
           <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-sky-400 transition-colors">
             Ladder <Info size={14} />
           </button>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4 hover:border-sky-500/30 transition-colors group">
          <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">🌍</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Distance</p>
          <p className="text-xl font-bold text-white">{worldTrips} <span className="text-sm font-normal text-slate-500">Earths</span></p>
        </div>
        <div className="glass-panel rounded-2xl p-4 hover:border-orange-500/30 transition-colors group">
          <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">🏔️</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Elevation</p>
          <p className="text-xl font-bold text-white">{everests} <span className="text-sm font-normal text-slate-500">Everests</span></p>
        </div>
      </div>
    </div>
  );
};
