
import React, { useState, useEffect } from 'react';
import { ProfileView } from './components/ProfileView';
import { WalletView } from './components/WalletView';
import { ActivityList } from './components/ActivityList';
import { MedalsGrid } from './components/MedalsGrid';
import { User, Wallet, TrendingUp, Award, LogIn } from 'lucide-react';
import { fetchDashboardData, initiateStravaAuth } from './services/api';
import { DashboardData, FellowshipClass, RankProgress, WalletData, EarnedMedal } from './types';
import { determineClass, calculateRankProgress, calculateEarnedMedals, COIN_VALUE_MAP } from './utils/logic';

type View = 'profile' | 'activities' | 'wallet' | 'medals';

function App() {
  const [activeView, setActiveView] = useState<View>('profile');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Derived State
  const [rankProgress, setRankProgress] = useState<RankProgress | null>(null);
  const [currentClass, setCurrentClass] = useState<FellowshipClass | null>(null);
  const [walletState, setWalletState] = useState<WalletData | null>(null);
  const [medals, setMedals] = useState<EarnedMedal[]>([]);

  useEffect(() => {
    const load = async () => {
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
      
      // Compute derived state based on logic.ts
      const rProgress = calculateRankProgress(dashboardData.totals.hours);
      setRankProgress(rProgress);
      
      const fClass = determineClass(dashboardData.activities);
      setCurrentClass(fClass);
      
      const earnedMedals = calculateEarnedMedals(dashboardData.activities);
      setMedals(earnedMedals);

      // Calculate wallet
      const coinCounts: Record<string, number> = {};
      let totalValue = 0;
      
      dashboardData.activities.forEach(a => {
        a.coins?.forEach(coin => {
          coinCounts[coin] = (coinCounts[coin] || 0) + 1;
          totalValue += COIN_VALUE_MAP[coin] || 0;
        });
      });

      // Mock history based on total value for the chart
      const history = Array.from({length: 6}).map((_, i) => ({
        date: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
        value: Math.floor(totalValue * ((i + 5) / 10))
      }));

      setWalletState({
        totalValue,
        coins: coinCounts,
        history
      });

      setLoading(false);
    };
    load();
  }, []);

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-all duration-200 active:scale-95 md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3 md:rounded-xl ${
          isActive 
            ? 'text-sky-400 md:bg-sky-500/10' 
            : 'text-slate-500 hover:text-slate-300 md:hover:bg-slate-800/50'
        }`}
      >
        <Icon 
          size={24} 
          className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} 
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span className={`text-[10px] font-medium md:text-sm ${isActive ? 'font-bold' : ''}`}>
          {label}
        </span>
      </button>
    );
  };

  if (loading || !data || !rankProgress || !currentClass || !walletState) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b1120] text-sky-500">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-t-transparent border-sky-500 animate-spin"></div>
          <p className="text-sm font-medium">Consulting the Palantír...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 selection:bg-sky-500/30 md:flex font-sans ornament-bg">
      
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-[#0b1120]/95 p-6 backdrop-blur-xl md:flex fixed inset-y-0 z-50">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-xl shadow-lg shadow-sky-500/20">
            ⚔️
          </div>
          <div>
            <h1 className="font-heading font-bold text-white">League</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider">of Strava</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2">
          <NavItem view="profile" icon={User} label="Profile" />
          <NavItem view="wallet" icon={Wallet} label="Wallet" />
          <NavItem view="activities" icon={TrendingUp} label="Activities" />
          <NavItem view="medals" icon={Award} label="Medals" />
        </nav>

        <div className="mt-auto rounded-xl bg-slate-900/50 p-4 border border-slate-800">
          <button 
            onClick={initiateStravaAuth}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors w-full"
          >
            <LogIn size={14} />
            Sync Strava Data
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-[#0b1120]/80 p-4 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          <h1 className="font-heading font-bold text-white">League of Strava</h1>
        </div>
        <button 
          onClick={initiateStravaAuth}
          className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-sky-400 border border-slate-700 hover:bg-slate-700"
        >
          Sync
        </button>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-3xl p-4 md:ml-64 md:p-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeView === 'profile' && (
            <ProfileView 
              athlete={data.athlete} 
              rankProgress={rankProgress} 
              fellowshipClass={currentClass}
              totals={data.totals}
            />
          )}
          {activeView === 'wallet' && <WalletView wallet={walletState} />}
          {activeView === 'activities' && <ActivityList activities={data.activities} />}
          {activeView === 'medals' && <MedalsGrid medals={medals} />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-[#0b1120]/95 pb-safe backdrop-blur-xl md:hidden">
        <div className="flex justify-around px-2 pb-1 pt-1">
          <NavItem view="profile" icon={User} label="Profile" />
          <NavItem view="wallet" icon={Wallet} label="Wallet" />
          <NavItem view="activities" icon={TrendingUp} label="Activities" />
          <NavItem view="medals" icon={Award} label="Medals" />
        </div>
      </nav>
    </div>
  );
}

export default App;