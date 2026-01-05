// src/components/HealingPanel.tsx
import { useState, useRef, useEffect } from 'react';
import type { HealingItems } from '../types';

interface HealingPanelProps {
  healingItems: HealingItems;
  onHealInstant: (target: 'shield' | 'life', amount: number) => void;
  onStartOverTimeHeal: (target: 'shield' | 'life', totalAmount: number, duration: number) => void;
  onClearActiveHeals: () => void;
  state: any;
}

export function HealingPanel({ healingItems, onHealInstant, onStartOverTimeHeal, onClearActiveHeals, state }: HealingPanelProps) {
  const [selectedShieldItem, setSelectedShieldItem] = useState('Arc Powercell');
  const [selectedLifeItem, setSelectedLifeItem] = useState('Bandage');
  const [simulateHealing, setSimulateHealing] = useState(false);
  const [isShieldDropdownOpen, setIsShieldDropdownOpen] = useState(false);
  const [isLifeDropdownOpen, setIsLifeDropdownOpen] = useState(false);

  const shieldDropdownRef = useRef<HTMLDivElement>(null);
  const lifeDropdownRef = useRef<HTMLDivElement>(null);

  const shieldItems = Object.entries(healingItems.shield.items);
  const lifeItems = Object.entries(healingItems.life.items);

  const selectedShield = healingItems.shield.items[selectedShieldItem];
  const selectedLife = healingItems.life.items[selectedLifeItem];

  const isShieldBroken = state.isPermanentlyBroken;
  const isDefeated = state.currentLife <= 0;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shieldDropdownRef.current && !shieldDropdownRef.current.contains(event.target as Node)) {
        setIsShieldDropdownOpen(false);
      }
      if (lifeDropdownRef.current && !lifeDropdownRef.current.contains(event.target as Node)) {
        setIsLifeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyShieldHeal = () => {
    if (isShieldBroken || isDefeated) return;
    if (selectedShield.duration > 0 && simulateHealing) {
      onStartOverTimeHeal('shield', selectedShield.amount, selectedShield.duration);
    } else {
      onHealInstant('shield', selectedShield.amount);
    }
  };

  const applyLifeHeal = () => {
    if (isDefeated) return;
    if (selectedLife.duration > 0 && simulateHealing) {
      onStartOverTimeHeal('life', selectedLife.amount, selectedLife.duration);
    } else {
      onHealInstant('life', selectedLife.amount);
    }
  };

  const handleShieldSelection = (name: string) => {
    setSelectedShieldItem(name);
    setIsShieldDropdownOpen(false);
  };

  const handleLifeSelection = (name: string) => {
    setSelectedLifeItem(name);
    setIsLifeDropdownOpen(false);
  };

  return (
    <div className={`glass rounded-2xl p-6 shadow-2xl shadow-black/20 border border-border/50 transition-all duration-300 ${isDefeated ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-heart-pulse text-emerald-300"></i>
            Healing
          </h3>
          <p className="text-slate-200 text-xs mt-1">Restore shield and life points</p>
        </div>
        <button
          onClick={onClearActiveHeals}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-700/30 flex items-center gap-2"
          title="Stop Active Heals"
        >
          <i className="fas fa-stop"></i>
          Stop
        </button>
      </div>

      {/* Simulate checkbox */}
      <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={simulateHealing}
              onChange={(e) => setSimulateHealing(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
              simulateHealing
                ? 'bg-cyan-500 border-cyan-500 shadow-lg shadow-cyan-500/30'
                : 'border-gray-600 bg-gray-900 group-hover:border-cyan-500/50'
            }`}>
              {simulateHealing && (
                <i className="fas fa-check text-white text-xs"></i>
              )}
            </div>
          </div>
          <div className="flex-1">
            <span className="text-sm text-slate-200 font-medium group-hover:text-cyan-300 transition-colors">Simulate over-time healing</span>
            <p className="text-xs text-slate-400 mt-0.5">Instant by default</p>
          </div>
        </label>
      </div>

      {/* Shield healing */}
      <div className="mb-6" ref={shieldDropdownRef}>
        <label className="block text-sm text-slate-200 font-medium mb-3 flex items-center gap-2">
          <i className="fas fa-shield-halved text-cyan-300"></i>
          Shield Healing
        </label>

        {/* Custom Dropdown Button */}
        <button
          onClick={() => !isShieldBroken && !isDefeated && setIsShieldDropdownOpen(!isShieldDropdownOpen)}
          className={`w-full px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 border hover:border-cyan-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none cursor-pointer flex items-center justify-between group ${
            isShieldBroken || isDefeated ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-600'
          }`}
          disabled={isShieldBroken || isDefeated}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <i className="fas fa-shield-halved text-cyan-400 text-sm"></i>
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-semibold text-white truncate">{selectedShieldItem}</div>
              <div className="text-xs text-slate-400 truncate">
                {selectedShield.amount} Capacity {selectedShield.duration > 0 ? `over ${selectedShield.duration}s` : 'Instant'}
              </div>
            </div>
          </div>
          <i className={`fas fa-chevron-down transition-transform duration-200 ${isShieldDropdownOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {/* Custom Dropdown Menu */}
        {isShieldDropdownOpen && (
          <div className="mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar">
            {shieldItems.map(([name, item]) => (
              <button
                key={name}
                onClick={() => handleShieldSelection(name)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-150 border-l-2 ${
                  selectedShieldItem === name
                    ? 'bg-cyan-500/10 border-cyan-500'
                    : 'bg-transparent border-transparent hover:bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-shield-halved text-cyan-400 text-sm"></i>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className={`font-medium truncate ${selectedShieldItem === name ? 'text-cyan-400' : 'text-slate-200'}`}>
                    {name}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{item.amount} Capacity</span>
                    {item.duration > 0 && <span className="text-amber-400">• {item.duration}s</span>}
                    {item.duration === 0 && <span className="text-emerald-400">• Instant</span>}
                  </div>
                </div>
                {selectedShieldItem === name && (
                  <i className="fas fa-check text-cyan-400 flex-shrink-0"></i>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Apply Shield Heal Button */}
        <button
          onClick={applyShieldHeal}
          disabled={isShieldBroken || isDefeated}
          className={`mt-3 w-full px-4 py-3 rounded-lg text-white text-sm font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
            isShieldBroken || isDefeated
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-cyan-600/20 hover:shadow-xl hover:shadow-cyan-500/30'
          }`}
        >
          <i className="fas fa-plus"></i>
          Apply Shield Regen
        </button>
      </div>

      {/* Life healing */}
      <div ref={lifeDropdownRef}>
        <label className="block text-sm text-slate-200 font-medium mb-3 flex items-center gap-2">
          <i className="fas fa-heart text-red-300"></i>
          Life Healing
        </label>

        {/* Custom Dropdown Button */}
        <button
          onClick={() => !isDefeated && setIsLifeDropdownOpen(!isLifeDropdownOpen)}
          className={`w-full px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 border hover:border-cyan-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none cursor-pointer flex items-center justify-between group ${
            isDefeated ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-600'
          }`}
          disabled={isDefeated}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <i className="fas fa-heart text-red-400 text-sm"></i>
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-semibold text-white truncate">{selectedLifeItem}</div>
              <div className="text-xs text-slate-400 truncate">
                {selectedLife.amount} HP {selectedLife.duration > 0 ? `over ${selectedLife.duration}s` : 'Instant'}
              </div>
            </div>
          </div>
          <i className={`fas fa-chevron-down transition-transform duration-200 ${isLifeDropdownOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {/* Custom Dropdown Menu */}
        {isLifeDropdownOpen && (
          <div className="mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar">
            {lifeItems.map(([name, item]) => (
              <button
                key={name}
                onClick={() => handleLifeSelection(name)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-150 border-l-2 ${
                  selectedLifeItem === name
                    ? 'bg-red-500/10 border-red-500'
                    : 'bg-transparent border-transparent hover:bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-heart text-red-400 text-sm"></i>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className={`font-medium truncate ${selectedLifeItem === name ? 'text-red-400' : 'text-slate-200'}`}>
                    {name}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{item.amount} HP</span>
                    {item.duration > 0 && <span className="text-amber-400">• {item.duration}s</span>}
                    {item.duration === 0 && <span className="text-emerald-400">• Instant</span>}
                  </div>
                </div>
                {selectedLifeItem === name && (
                  <i className="fas fa-check text-red-400 flex-shrink-0"></i>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Apply Life Heal Button */}
        <button
          onClick={applyLifeHeal}
          disabled={isDefeated}
          className={`mt-3 w-full px-4 py-3 rounded-lg text-white text-sm font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
            isDefeated
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-500/30'
          }`}
        >
          <i className="fas fa-plus"></i>
          Apply Life Heal
        </button>
      </div>
    </div>
  );
}
