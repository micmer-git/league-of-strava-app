
import React from 'react';
import { EarnedMedal } from '../types';

interface MedalsGridProps {
  medals: EarnedMedal[];
}

export const MedalsGrid: React.FC<MedalsGridProps> = ({ medals }) => {
  const rarityColors: Record<string, string> = {
    common: 'border-slate-700 bg-slate-800/50 text-slate-400',
    rare: 'border-sky-500/30 bg-sky-500/10 text-sky-300 shadow-sky-500/5',
    epic: 'border-purple-500/30 bg-purple-500/10 text-purple-300 shadow-purple-500/5',
    legendary: 'border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-amber-500/5',
    mythic: 'border-red-500/30 bg-red-500/10 text-red-400 shadow-red-500/5',
  };

  const categories = Array.from(new Set(medals.map(m => m.category)));

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-heading font-bold text-white">Trophy Case</h2>
        <p className="text-sm text-slate-400">Track every themed challenge and milestone.</p>
      </header>

      {categories.map(category => (
        <section key={category} className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 pl-1">{category}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {medals.filter(m => m.category === category).map((medal) => (
              <div 
                key={medal.name} 
                className={`relative flex flex-col gap-3 rounded-2xl border p-4 transition-transform active:scale-95 ${
                  medal.isEarned 
                    ? rarityColors[medal.rarity] + ' shadow-lg' 
                    : 'border-slate-800 bg-slate-900/50 opacity-60 grayscale'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl filter drop-shadow-md">{medal.emoji}</span>
                  {medal.count > 1 && (
                    <span className="rounded-full bg-slate-950/30 px-2 py-0.5 text-[10px] font-bold">
                      x{medal.count}
                    </span>
                  )}
                </div>
                
                <div>
                  <h3 className={`text-sm font-bold leading-tight ${medal.isEarned ? 'text-white' : 'text-slate-500'}`}>
                    {medal.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">
                    {medal.description}
                  </p>
                </div>

                {!medal.isEarned && medal.progress !== undefined && (
                  <div className="mt-auto pt-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider opacity-70 mb-1">
                      <span>Progress</span>
                      <span>{medal.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800">
                      <div 
                        className="h-full rounded-full bg-slate-500" 
                        style={{ width: `${medal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
