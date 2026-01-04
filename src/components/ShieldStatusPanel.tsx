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
      name: 'None',
      icon: 'fa-shield-slash',
      inactiveClass: 'bg-gray-900/50 hover:bg-gray-800/50 border-2 border-gray-700 text-gray-500 grayscale',
      activeClass: 'bg-gradient-to-r from-gray-400 to-gray-500 border-2 border-white text-gray-900 shadow-xl shadow-gray-400/40 ring-2 ring-white/50'
    },
    {
      key: 'light',
      name: 'Light',
      icon: 'fa-feather',
      inactiveClass: 'bg-gray-900/50 hover:bg-gray-800/50 border-2 border-gray-700 text-emerald-600/40 grayscale hover:grayscale-0',
      activeClass: 'bg-gradient-to-r from-emerald-400 to-emerald-500 border-2 border-emerald-300 text-white shadow-xl shadow-emerald-400/40 ring-2 ring-emerald-300/50'
    },
    {
      key: 'medium',
      name: 'Medium',
      icon: 'fa-shield-halved',
      inactiveClass: 'bg-gray-900/50 hover:bg-gray-800/50 border-2 border-gray-700 text-cyan-600/40 grayscale hover:grayscale-0',
      activeClass: 'bg-gradient-to-r from-cyan-400 to-cyan-500 border-2 border-cyan-300 text-white shadow-xl shadow-cyan-400/40 ring-2 ring-cyan-300/50'
    },
    {
      key: 'heavy',
      name: 'Heavy',
      icon: 'fa-shield-alt',
      inactiveClass: 'bg-gray-900/50 hover:bg-gray-800/50 border-2 border-gray-700 text-fuchsia-600/40 grayscale hover:grayscale-0',
      activeClass: 'bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 border-2 border-fuchsia-300 text-white shadow-xl shadow-fuchsia-400/40 ring-2 ring-fuchsia-300/50'
    },
    {
      key: 'custom',
      name: 'Custom',
      icon: 'fa-sliders-h',
      inactiveClass: 'bg-gray-900/50 hover:bg-gray-800/50 border-2 border-gray-700 text-amber-600/40 grayscale hover:grayscale-0',
      activeClass: 'bg-gradient-to-r from-amber-400 to-amber-500 border-2 border-amber-300 text-white shadow-xl shadow-amber-400/40 ring-2 ring-amber-300/50'
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
    <div className={`glass rounded-2xl p-6 shadow-2xl shadow-black/20 border ${state.borderColor} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${state.nameColor} flex items-center gap-2`}>
            <i className="fas fa-shield-halved"></i>
            {state.shieldName}
          </h2>
          <p className="text-slate-200 text-sm mt-1">
            Shield: {state.currentShield.toFixed(1)} / {state.maxShield} | Life: {state.currentLife.toFixed(1)} / {state.maxLife}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
          state.isPermanentlyBroken
            ? 'bg-red-500/10 border-red-500 text-red-400'
            : 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
        }`}>
          {state.isPermanentlyBroken ? 'BROKEN' : `${state.dr}% DR`}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <ProgressBar
          value={state.currentShield}
          max={state.maxShield}
          color={state.shieldColor}
          label="Shield"
          showDefeated={state.isPermanentlyBroken}
        />
        <ProgressBar
          value={state.currentLife}
          max={state.maxLife}
          color={state.currentLife < 25 ? 'bg-red-600' : state.currentLife < 50 ? 'bg-yellow-500' : 'bg-green-500'}
          label="Life"
          showDefeated={state.currentLife <= 0}
        />
      </div>

      {/* Durability indicator */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-300 font-medium">Durability</span>
          <span className={`text-sm font-bold ${state.currentDurability <= 0 ? 'text-red-400' : 'text-white'}`}>
            {state.currentDurability.toFixed(0)} / {state.maxDurability}
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden border border-border/50">
          <div
            className={`h-full transition-all duration-300 relative ${state.currentDurability <= 0 ? 'bg-destructive' : state.currentDurability < state.maxDurability / 3 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${(state.currentDurability / state.maxDurability) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.key}
            onClick={() => onPresetChange(preset.key)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border ${
              currentMode === preset.key
                ? `${preset.activeClass} scale-105`
                : `${preset.inactiveClass} hover:scale-102`
            }`}
          >
            <i className={`fas ${preset.icon} text-sm`}></i>
            {preset.name}
          </button>
        ))}
      </div>

      {/* Custom settings panel */}
      {currentMode === 'custom' && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-yellow-300/50">
          <h3 className="text-sm font-semibold text-yellow-200 mb-3">Custom Shield Settings</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-200 mb-1">Shield Charges</label>
              <input
                type="number"
                value={customSettings.charges}
                onChange={(e) => handleCustomSettingChange('charges', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-300"
                min={inputRanges?.baseDamage?.min || 1}
                max={inputRanges?.baseDamage?.max || 10000}
                step={inputRanges?.baseDamage?.step || 0.1}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-200 mb-1">DR %</label>
              <input
                type="number"
                value={customSettings.dr}
                onChange={(e) => handleCustomSettingChange('dr', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-300"
                min={0}
                max={100}
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-200 mb-1">Max Life</label>
              <input
                type="number"
                value={customSettings.life}

                onChange={(e) => handleCustomSettingChange('life', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-300"
                min={1}
                max={1000}
                step={1}
              />
            </div>
          </div>
          <button
            onClick={applyCustomSettings}
            className="w-full mt-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-sm font-medium transition-colors"
          >
            Apply Custom Settings
          </button>
        </div>
      )}
    </div>
  );
}