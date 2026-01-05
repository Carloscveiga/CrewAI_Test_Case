// src/components/ShieldStatusPanel.tsx
import { useState } from 'react';
import { ProgressBar } from './ProgressBar';

interface ShieldStatusPanelProps {
  state: any;
  currentMode: string;
  onPresetChange: (mode: string) => void;
  onUpdateCustomSettings: (settings: any) => void;
  inputRanges: any;
}

export function ShieldStatusPanel({ state, currentMode, onPresetChange, onUpdateCustomSettings, inputRanges }: ShieldStatusPanelProps) {
  const [customSettings, setCustomSettings] = useState({
    charges: 80,
    dr: 50,
    life: 100,
  });

  const presets = [
    {
      key: 'none',
      name: 'NONE',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
      colors: {
        inactive: 'bg-slate-800/50 border-slate-700 text-slate-500',
        active: 'bg-gradient-to-br from-slate-400 to-slate-500 border-slate-300 text-slate-900 shadow-lg shadow-slate-400/30',
      }
    },
    {
      key: 'light',
      name: 'LIGHT',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
      colors: {
        inactive: 'bg-slate-800/50 border-slate-700 text-emerald-500/60 hover:text-emerald-400',
        active: 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-300 text-white shadow-lg shadow-emerald-400/40',
      }
    },
    {
      key: 'medium',
      name: 'MED',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      colors: {
        inactive: 'bg-slate-800/50 border-slate-700 text-cyan-500/60 hover:text-cyan-400',
        active: 'bg-gradient-to-br from-cyan-400 to-cyan-500 border-cyan-300 text-white shadow-lg shadow-cyan-400/40',
      }
    },
    {
      key: 'heavy',
      name: 'HEAVY',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      colors: {
        inactive: 'bg-slate-800/50 border-slate-700 text-fuchsia-500/60 hover:text-fuchsia-400',
        active: 'bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 border-fuchsia-300 text-white shadow-lg shadow-fuchsia-400/40',
      }
    },
    {
      key: 'custom',
      name: 'CUSTOM',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
      colors: {
        inactive: 'bg-slate-800/50 border-slate-700 text-amber-500/60 hover:text-amber-400',
        active: 'bg-gradient-to-br from-amber-400 to-amber-500 border-amber-300 text-slate-900 shadow-lg shadow-amber-400/40',
      }
    },
  ];

  const handleCustomSettingChange = (field: string, value: number) => {
    setCustomSettings(prev => ({ ...prev, [field]: value }));
  };

  const applyCustomSettings = () => {
    onUpdateCustomSettings({
      maxShield: customSettings.charges,
      currentShield: customSettings.charges,
      dr: customSettings.dr,
      maxLife: customSettings.life,
      currentLife: customSettings.life,
      shieldColor: 'bg-yellow-400',
      shieldName: 'Custom Shield',
      nameColor: 'text-yellow-300',
      borderColor: 'border-yellow-300/50',
      maxDurability: customSettings.charges,
      currentDurability: customSettings.charges,
      isPermanentlyBroken: false,
      bulletsFired: 0,
      damageMitigated: 0,
      totalDamageTaken: 0,
      shieldRepaired: 0,
      lifeHealed: 0,
    });
  };

  return (
    <div className={`holo-glass tech-border rounded-lg p-6 transition-all duration-300 ${state.borderColor}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Shield Icon with Pulse Effect */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
              state.isPermanentlyBroken
                ? 'bg-red-500/10 border-red-500'
                : 'bg-cyan-500/10 border-cyan-500'
            }`}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>

              {/* Animated corner markers */}
              {!state.isPermanentlyBroken && (
                <>
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400"></div>
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-400"></div>
                  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cyan-400"></div>
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400"></div>
                </>
              )}
            </div>

            {/* Status indicator glow */}
            {!state.isPermanentlyBroken && (
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg -z-10 animate-[pulse-glow_2s_ease-in-out_infinite]"></div>
            )}
          </div>

          {/* Shield Info */}
          <div>
            <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wider ${state.nameColor} flex items-center gap-2 sm:gap-3`}>
              {state.shieldName}
              <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                state.isPermanentlyBroken
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              }`}>
                {state.isPermanentlyBroken ? 'OFFLINE' : 'ACTIVE'}
              </span>
            </h2>
            <div className="flex items-center gap-2 sm:gap-4 mt-2 font-mono text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span className="text-slate-400">SHIELD:</span>
                <span className="text-cyan-400 font-bold">{state.currentShield.toFixed(1)}</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-300">{state.maxShield}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-slate-400">LIFE:</span>
                <span className="text-red-400 font-bold">{state.currentLife.toFixed(1)}</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-300">{state.maxLife}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Damage Reduction Badge */}
        <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-mono text-xs sm:text-sm transition-all duration-200 ${
          state.isPermanentlyBroken
            ? 'bg-red-500/10 border-red-500/50 text-red-400'
            : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
        }`}>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Damage Reduction</div>
          <div className="text-xl font-bold">
            {state.isPermanentlyBroken ? 'OFFLINE' : `${state.dr}%`}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        <ProgressBar
          value={state.currentShield}
          max={state.maxShield}
          color={state.shieldColor}
          label="Shield Integrity"
          showDefeated={state.isPermanentlyBroken}
        />
        <ProgressBar
          value={state.currentLife}
          max={state.maxLife}
          color={state.currentLife < 25 ? 'bg-red-600' : state.currentLife < 50 ? 'bg-yellow-500' : 'bg-green-500'}
          label="Life Points"
          showDefeated={state.currentLife <= 0}
        />
      </div>

      {/* Durability Indicator - Technical Panel Style */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 relative overflow-hidden">
        {/* Scanning line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-[scanline_4s_linear_infinite] pointer-events-none"></div>

        <div className="flex justify-between items-center mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="text-sm text-slate-300 font-semibold uppercase tracking-wider">Durability</span>
          </div>
          <span className={`font-mono text-sm font-bold ${state.currentDurability <= 0 ? 'text-red-400' : 'text-cyan-400'}`}>
            {state.currentDurability.toFixed(0)} / {state.maxDurability}
          </span>
        </div>

        {/* Technical progress bar */}
        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative z-10">
          <div
            className={`h-full transition-all duration-300 relative ${state.currentDurability <= 0 ? 'bg-red-500' : state.currentDurability < state.maxDurability / 3 ? 'bg-yellow-500' : 'data-bar'}`}
            style={{ width: `${(state.currentDurability / state.maxDurability) * 100}%` }}
          >
            {/* Animated shine overlay */}
            {state.currentDurability > 0 && state.currentDurability >= state.maxDurability / 3 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[data-stream_2s_linear_infinite]"></div>
            )}
          </div>
        </div>

        {/* Technical markings */}
        <div className="flex justify-between mt-2 text-xs text-slate-600 font-mono relative z-10">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Preset Buttons - Technical Button Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.key}
            onClick={() => onPresetChange(preset.key)}
            className={`group relative px-3 py-3 rounded-lg text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 border ${
              currentMode === preset.key
                ? `${preset.colors.active} scale-105 shadow-xl`
                : `${preset.colors.inactive} hover:scale-102`
            }`}
            aria-label={`Select ${preset.name} shield preset`}
            aria-pressed={currentMode === preset.key}
          >
            {preset.icon}
            <span className="tracking-wider">{preset.name}</span>

            {/* Active indicator corner markers */}
            {currentMode === preset.key && (
              <>
                <div className="absolute top-1 left-1 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/80 rounded-full"></div>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Custom Settings Panel */}
      {currentMode === 'custom' && (
        <div className="mt-4 p-5 bg-slate-800/70 rounded-lg border border-amber-500/30 tech-border animate-[slide-in-left_0.3s_ease-out]">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider">Custom Configuration</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Shield Charges Input */}
            <div>
              <label htmlFor="custom-charges" className="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                Shield Charges
              </label>
              <input
                id="custom-charges"
                type="number"
                value={customSettings.charges}
                onChange={(e) => handleCustomSettingChange('charges', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                min={inputRanges?.baseDamage?.min || 1}
                max={inputRanges?.baseDamage?.max || 10000}
                step={inputRanges?.baseDamage?.step || 0.1}
                aria-label="Custom shield charges value"
              />
            </div>

            {/* Damage Reduction Input */}
            <div>
              <label htmlFor="custom-dr" className="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                DR Percentage
              </label>
              <input
                id="custom-dr"
                type="number"
                value={customSettings.dr}
                onChange={(e) => handleCustomSettingChange('dr', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                min={0}
                max={100}
                step={0.1}
                aria-label="Custom damage reduction percentage"
              />
            </div>

            {/* Max Life Input */}
            <div>
              <label htmlFor="custom-life" className="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                Max Life
              </label>
              <input
                id="custom-life"
                type="number"
                value={customSettings.life}
                onChange={(e) => handleCustomSettingChange('life', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                min={1}
                max={1000}
                step={1}
                aria-label="Custom max life value"
              />
            </div>
          </div>

          <button
            onClick={applyCustomSettings}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-600/40 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Apply Configuration
          </button>
        </div>
      )}
    </div>
  );
}
