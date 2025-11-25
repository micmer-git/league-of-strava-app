
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WalletData } from '../types';

interface WalletViewProps {
  wallet: WalletData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel rounded-lg p-3 shadow-xl border border-slate-700">
        <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>
        <p className="text-lg font-bold text-sky-400">
          ${(payload[0].value / 1000000).toFixed(2)}M
        </p>
      </div>
    );
  }
  return null;
};

export const WalletView: React.FC<WalletViewProps> = ({ wallet }) => {
  const formatMillions = (value: number) => `$${(value / 1000000).toFixed(1)}M`;

  return (
    <div className="space-y-6 pb-24">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-heading font-bold text-white tracking-tight">
          {formatMillions(wallet.totalValue)}
        </h2>
        <p className="text-sm text-slate-400">Total Achievement Value</p>
      </header>

      {/* Coin Stash */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {Object.entries(wallet.coins).map(([key, count]) => {
          const emojiMap: Record<string, string> = {
            dollar: '💲',
            moneybag: '💰',
            butter: '🧈',
            diamond: '💎',
            crown: '👑'
          };
          const colorMap: Record<string, string> = {
            dollar: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
            moneybag: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            butter: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            diamond: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            crown: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          };
          
          return (
            <div key={key} className={`flex flex-col items-center justify-center rounded-xl border p-3 ${colorMap[key]}`}>
              <span className="text-2xl mb-1">{emojiMap[key]}</span>
              <span className="text-lg font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <section className="glass-panel rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-white">Wallet Growth</h3>
          <select className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1 outline-none focus:border-sky-500">
            <option>Last 6 Months</option>
            <option>Last Year</option>
            <option>All Time</option>
          </select>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wallet.history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickFormatter={(val) => `$${val/1000000}M`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#38bdf8', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#38bdf8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Monthly Breakdown */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="font-heading font-bold text-white">Recent Gains</h3>
        </div>
        <div className="divide-y divide-slate-700/50">
          {['June', 'May', 'April'].map((month, idx) => (
            <div key={month} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  +{Math.floor(Math.random() * 10)}%
                </div>
                <div>
                  <p className="font-bold text-white">{month} 2024</p>
                  <p className="text-xs text-slate-400">45 activities logged</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sky-400">+$142k</p>
                <p className="text-xs text-slate-500">Earned</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
