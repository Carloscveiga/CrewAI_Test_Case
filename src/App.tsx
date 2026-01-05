import { useState } from 'react';
import { useAppData } from './hooks/useAppData';
import { useShieldSimulator } from './hooks/useShieldSimulator';
import { Header } from './components/Header';
import { ShieldStatusPanel } from './components/ShieldStatusPanel';
import { StatsGrid } from './components/StatsGrid';
import { ApplyDamagePanel } from './components/ApplyDamagePanel';
import { ActionLogPanel } from './components/ActionLogPanel';
import { HealingPanel } from './components/HealingPanel';
import { HealingStatsGrid } from './components/HealingStatsGrid';
import type { CombatItemWithCategory } from './types';

function App() {
  const { data, loading, error } = useAppData();
  const [currentMode, setCurrentMode] = useState('heavy');

  const simulator = useShieldSimulator(
    data?.shieldPresets?.heavy || {
      charges: 80, dr: 52.5, life: 100, name: 'Heavy Shield',
      nameColor: 'text-pink-400', barColor: 'bg-pink-600', borderColor: 'border-pink-500/30'
    },
    data?.constants?.MAX_HISTORY?.value || 50
  );

  const ehp = simulator.calculateEHP();

  const getAllCombatItems = (): CombatItemWithCategory[] => {
    if (!data) return [];
    const items: CombatItemWithCategory[] = [];
    Object.entries(data.weapons.items).forEach(([name, item]) => items.push({ name, item, category: 'weapon' }));
    Object.entries(data.gadgets.items).forEach(([name, item]) => items.push({ name, item, category: 'gadget' }));
    Object.entries(data.deployables.items).forEach(([name, item]) => items.push({ name, item, category: 'deployable' }));
    return items.sort((a, b) => b.item.damage - a.item.damage);
  };

  const handlePresetChange = (mode: string) => {
    setCurrentMode(mode);
    if (mode !== 'custom') {
      const preset = data?.shieldPresets?.[mode as keyof typeof data.shieldPresets];
      if (preset) {
        simulator.applyPreset(preset);
      }
    }
  };

  const handleApplyDamage = (baseDamage: number, multiplier: number, projectiles: number, triggers: number, label: string, weaponName: string) => {
    simulator.applyDamage(baseDamage, multiplier, projectiles, triggers, label, weaponName);
  };

  const handleApplyHeal = (target: 'shield' | 'life', amount: number) => {
    simulator.healInstant(target, amount);
  };

  const handleStartOverTimeHeal = (target: 'shield' | 'life', totalAmount: number, duration: number) => {
    simulator.startOverTimeHeal(target, totalAmount, duration);
  };

  const handleClearActiveHeals = () => {
    simulator.clearActiveHeals();
  };

  const handleCopyLog = () => {
    // Show toast notification
    alert('Log copied to clipboard!');
  };

  const handleUndo = () => {
    simulator.undo();
  };

  const handleRedo = () => {
    simulator.redo();
  };

  const handleClearLogs = () => {
    simulator.clearLogs();
  };

  const handleUpdateCustomSettings = (settings: any) => {
    simulator.updateCustomSettings(settings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center scanlines grid-pattern">
        <div className="text-center relative z-10">
          <div className="loading-spinner mx-auto mb-6"></div>
          <p className="text-lg font-['Orbitron'] uppercase tracking-widest text-cyan-400">Initializing Systems</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center scanlines grid-pattern">
        <div className="text-center relative z-10 holo-glass p-8 rounded-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-['Orbitron'] uppercase tracking-widest text-red-400 mb-2">System Error</p>
          <p className="text-sm text-slate-400 font-mono">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 scanlines"></div>
      <div className="fixed inset-0 grid-pattern"></div>

      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Cyan orb - top right */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 25s ease-in-out infinite',
          }}
        ></div>

        {/* Purple orb - bottom left */}
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 30s ease-in-out infinite',
            animationDelay: '5s',
          }}
        ></div>

        {/* Amber orb - center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(255, 149, 0, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Shield Status & Stats (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <ShieldStatusPanel
                state={simulator.state}
                currentMode={currentMode}
                onPresetChange={handlePresetChange}
                onUpdateCustomSettings={handleUpdateCustomSettings}
                inputRanges={data.inputRanges}
              />
              <StatsGrid state={simulator.state} ehp={ehp} />
              <ApplyDamagePanel
                combatItems={getAllCombatItems()}
                damageMultipliers={data.damageMultipliers}
                inputRanges={data.inputRanges}
                onApplyDamage={handleApplyDamage}
                isHitFatal={simulator.isHitFatal}
                state={simulator.state}
              />
            </div>

            {/* Right Column - Action Log & Healing (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <ActionLogPanel
                logs={simulator.logs}
                canUndo={simulator.canUndo}
                canRedo={simulator.canRedo}
                onCopyLog={handleCopyLog}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onClearLogs={handleClearLogs}
              />
              <HealingStatsGrid state={simulator.state} />
              <HealingPanel
                healingItems={data.healingItems}
                onHealInstant={handleApplyHeal}
                onStartOverTimeHeal={handleStartOverTimeHeal}
                onClearActiveHeals={handleClearActiveHeals}
                state={simulator.state}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center pb-8">
          <div className="holo-glass inline-block px-6 py-3 rounded-lg tech-border">
            <p className="text-xs text-slate-400 font-mono">
              <span className="text-cyan-400">SYS.VER</span> 2.0.0 | <span className="text-cyan-400">LAST.UPD</span> {data.metadata.lastUpdated}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
