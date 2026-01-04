// src/components/HealingPanel.tsx
import React, { useState } from 'react';
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

  const shieldItems = Object.entries(healingItems.shield.items);
  const lifeItems = Object.entries(healingItems.life.items);

  const selectedShield = healingItems.shield.items[selectedShieldItem];
  const selectedLife = healingItems.life.items[selectedLifeItem];

  const isShieldBroken = state.isPermanentlyBroken;
  const isDefeated = state.currentLife <= 0;

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
      <div className="mb-6">
        <label className="block text-sm text-slate-200 font-medium mb-3 flex items-center gap-2">
          <i className="fas fa-shield-halved text-cyan-300"></i>
          Shield Healing
        </label>
        <div className="flex gap-2">
          <select
            value={selectedShieldItem}
            onChange={(e) => setSelectedShieldItem(e.target.value)}
            disabled={isShieldBroken}
            className={`flex-1 min-w-0 px-4 py-3 bg-gray-900 border ${isShieldBroken ? 'border-gray-700 opacity-50' : 'border-gray-600 hover:border-cyan-500/50'} rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:cursor-not-allowed appearance-none cursor-pointer`}
          >
            {shieldItems.map(([name, item]) => (
              <option key={name} value={name}>
                {name} - {item.amount} Capacity {item.duration > 0 ? `over ${item.duration}s` : 'Instant'}
              </option>
            ))}
          </select>
          <button
            onClick={applyShieldHeal}
            disabled={isShieldBroken || isDefeated}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-700/30 flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-shield-halved"></i>
            Apply
          </button>
        </div>
      </div>

      {/* Life healing */}
      <div>
        <label className="block text-sm text-slate-200 font-medium mb-3 flex items-center gap-2">
          <i className="fas fa-heart text-red-300"></i>
          Life Healing
        </label>
        <div className="flex gap-2">
          <select
            value={selectedLifeItem}
            onChange={(e) => setSelectedLifeItem(e.target.value)}
            disabled={isDefeated}
            className={`flex-1 min-w-0 px-4 py-3 bg-gray-900 border ${isDefeated ? 'border-gray-700 opacity-50' : 'border-gray-600 hover:border-cyan-500/50'} rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:cursor-not-allowed appearance-none cursor-pointer`}
          >
            {lifeItems.map(([name, item]) => (
              <option key={name} value={name}>
                {name} - {item.amount} HP {item.duration > 0 ? `over ${item.duration}s` : 'Instant'}
              </option>
            ))}
          </select>
          <button
            onClick={applyLifeHeal}
            disabled={isDefeated}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-700/30 flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-plus"></i>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
