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
      <div className="min-h-screen bg-[#15141F] text-white flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4 text-blue-400"></i>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#15141F] text-white flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
          <p className="text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

      {/* Animated gradient overlays */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/20 via-transparent to-cyan-900/20 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      {/* Floating animated orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large purple orb - top right */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/30 to-violet-900/20 rounded-full blur-3xl animate-float" style={{ animationDuration: '20s' }}></div>

        {/* Medium blue orb - bottom left */}
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-blue-600/25 to-cyan-900/15 rounded-full blur-3xl animate-float" style={{ animationDuration: '25s', animationDelay: '5s' }}></div>

        {/* Small pink orb - top left */}
        <div className="absolute top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-pink-600/20 to-rose-900/10 rounded-full blur-3xl animate-float" style={{ animationDuration: '18s', animationDelay: '3s' }}></div>

        {/* Medium cyan orb - bottom right */}
        <div className="absolute -bottom-20 -right-20 w-[350px] h-[350px] bg-gradient-to-tl from-cyan-600/20 to-blue-900/10 rounded-full blur-3xl animate-float" style={{ animationDuration: '22s', animationDelay: '7s' }}></div>

        {/* Center ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10">
        <Header />
        <main className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 min-w-0">
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
          <div className="space-y-6 min-w-0 overflow-hidden">
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
      <footer className="mt-8 text-center text-xs text-slate-400 pb-4">
        Last Updated: {data.metadata.lastUpdated}
      </footer>
      </div>
    </div>
  );
}

export default App;