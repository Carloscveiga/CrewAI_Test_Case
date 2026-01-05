# ARC Raiders Damage Calculator - React Build Guide

## Overview

This guide provides step-by-step instructions for building the ARC Raiders Damage Calculator as a React + TypeScript application with Tailwind CSS.

**Prerequisites:**
- Freshly built React + Vite app with TypeScript
- Tailwind CSS already installed and configured
- Node.js and npm installed

**Implementation Requirements:**
- All data must be fetched from sourceapp.json in the public folder (NOT hardcoded)
- Proper TypeScript interfaces/types for all data structures
- Component-based architecture
- State management with React hooks
- Responsive design with Tailwind CSS
- Match exact functionality from documentation

---

## Step 1: Copy Mock Data to Public Folder

**Action:** Copy the sourceapp.json file to the public folder of your React application.

**Source Path:** C:\Users\example\researcher\output\sourceapp.json

**Destination Path:** public/sourceapp.json

**Purpose:** This JSON file contains all application data including shield presets, weapons, healing items, constants, and configuration values. The React app will fetch this data at runtime.

---

## Step 2: Create TypeScript Type Definitions

Create a file: src/types/index.ts

This file will contain all TypeScript interfaces matching the JSON structure.

```typescript
// src/types/index.ts

// Constants
export interface Constants {
  DEFAULT_MAX_LIFE: { type: string; value: number; purpose: string };
  MAX_HISTORY: { type: string; value: number; purpose: string };
}

// Shield Preset
export interface ShieldPreset {
  type: string;
  charges: number;
  dr: number;
  life: number;
  name: string;
  nameColor: string;
  barColor: string;
  borderColor: string;
  purpose: string;
}

// Shield Presets Collection
export interface ShieldPresets {
  none: ShieldPreset;
  light: ShieldPreset;
  medium: ShieldPreset;
  heavy: ShieldPreset;
  custom: ShieldPreset;
}

// Healing Item
export interface HealingItem {
  amount: number;
  duration: number;
  useTime: number;
  color: string;
  mode?: 'hold';
  purpose: string;
}

// Healing Items Collection
export interface HealingItems {
  shield: {
    type: string;
    items: Record<string, HealingItem>;
    purpose: string;
  };
  life: {
    type: string;
    items: Record<string, HealingItem>;
    purpose: string;
  };
}

// Weapon/Gadget/Deployable Item
export interface CombatItem {
  damage: number;
  hsm?: number;
  projectiles?: number;
  color: string;
  purpose: string;
}

// Weapons Collection
export interface Weapons {
  type: string;
  items: Record<string, CombatItem>;
  purpose: string;
}

// Gadgets Collection
export interface Gadgets {
  type: string;
  items: Record<string, CombatItem>;
  purpose: string;
}

// Deployables Collection
export interface Deployables {
  type: string;
  items: Record<string, CombatItem>;
  purpose: string;
}

// Damage Multipliers
export interface DamageMultipliers {
  type: string;
  legShot: { multiplier: number; label: string; purpose: string };
  bodyShot: { multiplier: number; label: string; purpose: string };
  headShot: { multiplier: number; label: string; purpose: string };
  purpose: string;
}

// Simulation Settings
export interface Simulation {
  type: string;
  defaultRPM: { type: string; value: number; purpose: string };
  minRPM: { type: string; value: number; purpose: string };
  maxRPM: { type: string; value: number; purpose: string };
  maxTriggers: { type: string; value: number; purpose: string };
  tickRate: { type: string; value: number; purpose: string };
  purpose: string;
}

// Input Ranges
export interface InputRanges {
  type: string;
  baseDamage: { min: number; max: number; step: number; default: number; purpose: string };
  projectileCount: { min: number; max: number; step: number; default: number; purpose: string };
  triggerCount: { min: number; max: number; step: number; default: number; purpose: string };
  headshotMultiplier: { min: number; max: number; step: number; default: number; purpose: string };
  purpose: string;
}

// Simulator State
export interface SimulatorState {
  maxShield: number;
  currentShield: number;
  dr: number;
  maxLife: number;
  currentLife: number;
  shieldColor: string;
  shieldName: string;
  nameColor: string;
  borderColor: string;
  maxDurability: number;
  currentDurability: number;
  isPermanentlyBroken: boolean;
  bulletsFired: number;
  damageMitigated: number;
  totalDamageTaken: number;
  shieldRepaired: number;
  lifeHealed: number;
}

// State Snapshot for Undo/Redo
export interface StateSnapshot {
  currentShield: number;
  currentLife: number;
  currentDurability: number;
  isPermanentlyBroken: boolean;
  bulletsFired: number;
  damageMitigated: number;
  totalDamageTaken: number;
  shieldRepaired: number;
  lifeHealed: number;
  logHTML: string;
}

// Damage Result
export interface DamageResult {
  shieldLost: number;
  lifeLost: number;
  broken: boolean;
  defeated: boolean;
}

// Log Entry Types
export type LogType = 'info' | 'success' | 'error' | 'shield-break' | 'perm-break' | 'shield-repair' | 'defeated' | 'attack' | 'heal';

// Log Entry
export interface LogEntry {
  id: string;
  message: string;
  type: LogType;
  timestamp: Date;
}

// Full API Data Structure
export interface AppData {
  constants: Constants;
  shieldPresets: ShieldPresets;
  healingItems: HealingItems;
  weapons: Weapons;
  gadgets: Gadgets;
  deployables: Deployables;
  damageMultipliers: DamageMultipliers;
  simulation: Simulation;
  inputRanges: InputRanges;
  stateManagement: any;
  damageResultStructure: any;
  logTypes: any;
  metadata: {
    applicationName: string;
    version: string;
    lastUpdated: string;
    author: string;
    purpose: string;
  };
}

// Combat Item with category
export interface CombatItemWithCategory {
  name: string;
  item: CombatItem;
  category: 'weapon' | 'gadget' | 'deployable';
}
```

---

## Step 3: Create Data Fetching Hook

Create a file: src/hooks/useAppData.ts

This hook will fetch the JSON data from the public folder.

```typescript
// src/hooks/useAppData.ts
import { useState, useEffect } from 'react';
import { AppData } from '../types';

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/sourceapp.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData: AppData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading app data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
```

---

## Step 4: Create Simulator Hook (Core Logic)

Create a file: src/hooks/useShieldSimulator.ts

This hook contains all the simulation logic for damage, healing, and state management.

```typescript
// src/hooks/useShieldSimulator.ts
import { useState, useCallback, useRef } from 'react';
import { SimulatorState, DamageResult, StateSnapshot, LogEntry, LogType, ShieldPreset } from '../types';

export function useShieldSimulator(initialPreset: ShieldPreset, maxHistory: number = 50) {
  const [state, setState] = useState<SimulatorState>({
    maxShield: initialPreset.charges,
    currentShield: initialPreset.charges,
    dr: initialPreset.dr,
    maxLife: initialPreset.life,
    currentLife: initialPreset.life,
    shieldColor: initialPreset.barColor,
    shieldName: initialPreset.name,
    nameColor: initialPreset.nameColor,
    borderColor: initialPreset.borderColor,
    maxDurability: initialPreset.charges,
    currentDurability: initialPreset.charges,
    isPermanentlyBroken: false,
    bulletsFired: 0,
    damageMitigated: 0,
    totalDamageTaken: 0,
    shieldRepaired: 0,
    lifeHealed: 0,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [actionHistory, setActionHistory] = useState<StateSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const activeIntervals = useRef<NodeJS.Timeout[]>([]);

  const addLog = useCallback((message: string, type: LogType) => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random(),
      message,
      type,
      timestamp: new Date(),
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const saveState = useCallback(() => {
    const snapshot: StateSnapshot = {
      currentShield: state.currentShield,
      currentLife: state.currentLife,
      currentDurability: state.currentDurability,
      isPermanentlyBroken: state.isPermanentlyBroken,
      bulletsFired: state.bulletsFired,
      damageMitigated: state.damageMitigated,
      totalDamageTaken: state.totalDamageTaken,
      shieldRepaired: state.shieldRepaired,
      lifeHealed: state.lifeHealed,
      logHTML: JSON.stringify(logs),
    };
    const newHistory = actionHistory.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > maxHistory) {
      newHistory.shift();
    }
    setActionHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [state, logs, actionHistory, historyIndex, maxHistory]);

  const applyPreset = useCallback((preset: ShieldPreset) => {
    clearLogs();
    setState({
      maxShield: preset.charges,
      currentShield: preset.charges,
      dr: preset.dr,
      maxLife: preset.life,
      currentLife: preset.life,
      shieldColor: preset.barColor,
      shieldName: preset.name,
      nameColor: preset.nameColor,
      borderColor: preset.borderColor,
      maxDurability: preset.charges,
      currentDurability: preset.charges,
      isPermanentlyBroken: false,
      bulletsFired: 0,
      damageMitigated: 0,
      totalDamageTaken: 0,
      shieldRepaired: 0,
      lifeHealed: 0,
    });
    addLog(`Initialized with ${preset.name}`, 'info');
    saveState();
  }, [clearLogs, addLog, saveState]);

  const applyDamage = useCallback((baseDamage: number, multiplier: number, projectiles: number, triggers: number, label: string, weaponName: string = '') => {
    let totalShieldLost = 0;
    let totalLifeLost = 0;
    let shieldBroke = false;
    let defeated = false;

    setState(prev => {
      let newShield = prev.currentShield;
      let newDurability = prev.currentDurability;
      let newLife = prev.currentLife;
      let newBroken = prev.isPermanentlyBroken;
      let shieldLostBatch = 0;
      let lifeLostBatch = 0;

      for (let t = 0; t < triggers; t++) {
        for (let p = 0; p < projectiles; p++) {
          if (newShield > 0 && !newBroken) {
            const damageToShield = Math.min(newShield, baseDamage);
            shieldLostBatch += damageToShield;
            newShield -= damageToShield;
            newDurability -= damageToShield;
            if (newDurability <= 0 && !prev.isPermanentlyBroken) {
              newBroken = true;
              shieldBroke = true;
            }
            const mitigatedBase = baseDamage * (1 - prev.dr / 100);
            const lifeDamage = mitigatedBase * multiplier;
            lifeLostBatch += Math.min(newLife, lifeDamage);
            newLife -= lifeDamage;
          } else {
            const lifeDamage = baseDamage * multiplier;
            lifeLostBatch += Math.min(newLife, lifeDamage);
            newLife -= lifeDamage;
          }
          if (newLife < 1.0) {
            defeated = true;
            break;
          }
        }
        if (defeated) break;
      }
      totalShieldLost = shieldLostBatch;
      totalLifeLost = lifeLostBatch;
      return {
        ...prev,
        currentShield: Math.max(0, newShield),
        currentDurability: Math.max(0, newDurability),
        currentLife: Math.max(0, newLife),
        isPermanentlyBroken: newBroken,
        bulletsFired: prev.bulletsFired + (triggers * projectiles),
        damageMitigated: prev.damageMitigated + (baseDamage * triggers * projectiles - totalLifeLost),
        totalDamageTaken: prev.totalDamageTaken + totalLifeLost,
      };
    });

    if (shieldBroke) {
      addLog('Shield permanently broken!', 'perm-break');
    }
    if (defeated) {
      addLog('DEFEATED!', 'defeated');
    }
    const message = weaponName 
      ? `${label} with ${weaponName}: ${totalShieldLost.toFixed(1)} shield, ${totalLifeLost.toFixed(1)} life lost`
      : `${label}: ${totalShieldLost.toFixed(1)} shield, ${totalLifeLost.toFixed(1)} life lost`;
    addLog(message, 'attack');
    saveState();
  }, [addLog, saveState]);

  const isHitFatal = useCallback((baseDamage: number, multiplier: number, projectiles: number, triggers: number): boolean => {
    let tempShield = state.currentShield;
    let tempDurability = state.currentDurability;
    let tempLife = state.currentLife;
    let tempBroken = state.isPermanentlyBroken;

    for (let t = 0; t < triggers; t++) {
      for (let p = 0; p < projectiles; p++) {
        if (tempShield > 0 && !tempBroken) {
          const damageToShield = Math.min(tempShield, baseDamage);
          tempShield -= damageToShield;
          tempDurability -= damageToShield;
          if (tempDurability <= 0) tempBroken = true;
          const mitigatedBase = baseDamage * (1 - state.dr / 100);
          const lifeDamage = mitigatedBase * multiplier;
          tempLife -= lifeDamage;
        } else {
          const lifeDamage = baseDamage * multiplier;
          tempLife -= lifeDamage;
        }
        if (tempLife < 1.0) return true;
      }
    }
    return tempLife < 1.0;
  }, [state.currentShield, state.currentDurability, state.isPermanentlyBroken, state.dr]);

  const healInstant = useCallback((target: 'shield' | 'life', amount: number) => {
    setState(prev => {
      if (target === 'shield') {
        const actualHealed = Math.min(prev.maxShield - prev.currentShield, amount);
        return { ...prev, currentShield: prev.currentShield + actualHealed, shieldRepaired: prev.shieldRepaired + actualHealed };
      } else {
        const actualHealed = Math.min(prev.maxLife - prev.currentLife, amount);
        return { ...prev, currentLife: prev.currentLife + actualHealed, lifeHealed: prev.lifeHealed + actualHealed };
      }
    });
    addLog(`Healed ${amount} ${target}`, 'heal');
    saveState();
  }, [addLog, saveState]);

  const startOverTimeHeal = useCallback((target: 'shield' | 'life', totalAmount: number, duration: number) => {
    const tickRate = 0.1;
    const ticks = duration / tickRate;
    const amountPerTick = totalAmount / ticks;

    const interval = setInterval(() => {
      setState(prev => {
        if (target === 'shield') {
          const actualHealed = Math.min(prev.maxShield - prev.currentShield, amountPerTick);
          return { ...prev, currentShield: prev.currentShield + actualHealed, shieldRepaired: prev.shieldRepaired + actualHealed };
        } else {
          const actualHealed = Math.min(prev.maxLife - prev.currentLife, amountPerTick);
          return { ...prev, currentLife: prev.currentLife + actualHealed, lifeHealed: prev.lifeHealed + actualHealed };
        }
      });
    }, tickRate * 1000);
    activeIntervals.current.push(interval);
    addLog(`Started ${target} regeneration: ${totalAmount} over ${duration}s`, 'heal');
  }, [addLog]);

  const clearActiveHeals = useCallback(() => {
    activeIntervals.current.forEach(interval => clearInterval(interval));
    activeIntervals.current = [];
  }, []);

  const calculateEHP = useCallback((): number => {
    const effectivePool = Math.max(0, state.currentLife - 0.5);
    const damageFactor = 1 - (state.dr / 100);
    if (state.currentShield > 0 && !state.isPermanentlyBroken) {
      return effectivePool / damageFactor;
    }
    return effectivePool;
  }, [state.currentLife, state.dr, state.currentShield, state.isPermanentlyBroken]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const snapshot = actionHistory[newIndex];
      setState(prev => ({ ...prev, currentShield: snapshot.currentShield, currentLife: snapshot.currentLife, currentDurability: snapshot.currentDurability, isPermanentlyBroken: snapshot.isPermanentlyBroken, bulletsFired: snapshot.bulletsFired, damageMitigated: snapshot.damageMitigated, totalDamageTaken: snapshot.totalDamageTaken, shieldRepaired: snapshot.shieldRepaired, lifeHealed: snapshot.lifeHealed }));
      try { setLogs(JSON.parse(snapshot.logHTML)); } catch { setLogs([]); }
    }
  }, [historyIndex, actionHistory]);

  const redo = useCallback(() => {
    if (historyIndex < actionHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const snapshot = actionHistory[newIndex];
      setState(prev => ({ ...prev, currentShield: snapshot.currentShield, currentLife: snapshot.currentLife, currentDurability: snapshot.currentDurability, isPermanentlyBroken: snapshot.isPermanentlyBroken, bulletsFired: snapshot.bulletsFired, damageMitigated: snapshot.damageMitigated, totalDamageTaken: snapshot.totalDamageTaken, shieldRepaired: snapshot.shieldRepaired, lifeHealed: snapshot.lifeHealed }));
      try { setLogs(JSON.parse(snapshot.logHTML)); } catch { setLogs([]); }
    }
  }, [historyIndex, actionHistory]);

  return {
    state, logs, canUndo: historyIndex > 0, canRedo: historyIndex < actionHistory.length - 1,
    applyPreset, applyDamage, healInstant, startOverTimeHeal, clearActiveHeals, calculateEHP, isHitFatal, undo, redo, clearLogs, addLog,
    updateCustomSettings: useCallback((settings: Partial<SimulatorState>) => setState(prev => ({ ...prev, ...settings })), []),
  };
}
```

---

## Step 5: Create UI Components

Create the following component files in src/components/:

### Header.tsx
- App title with subtitle
- Social media links (YouTube, Twitch, Discord, Ko-Fi)
- How it Works link
- Sticky header with backdrop blur

### ProgressBar.tsx
- Props: value, max, color, label, valueLabel, prediction, showDefeated
- Displays progress with percentage
- Prediction bar overlay
- Defeated overlay when triggered

### ShieldStatusPanel.tsx
- Displays shield and life bars using ProgressBar
- 5 preset buttons: None, Light, Medium, Heavy, Custom
- Custom settings panel with inputs
- Durability indicator
- Resistance label

### StatsGrid.tsx
- 4 stat cards in grid layout
- Shots Fired, Dmg Mitigated, Potential Dmg, Current EHP
- Color-coded values (amber, cyan, red, purple)
- Tooltips on hover

### ApplyDamagePanel.tsx
- Weapon preset dropdown with categories
- Custom headshot multiplier input
- Inputs: Base Damage, Projectiles, Triggers Pulled
- 3 shot buttons: Leg Shot (x0.75), Body Shot (x1), Head Shot (xHSM)
- Fatal indicator styling (dark red, red border)
- Disabled when defeated

### ActionLogPanel.tsx
- Scrollable log output
- Color-coded entries by type
- Icons for each log type
- Copy, Undo, Redo buttons
- Timestamps

### HealingPanel.tsx
- Shield item dropdown and button
- Life item dropdown and button
- Simulate checkbox
- Disabled when shield broken or defeated

### HealingStatsGrid.tsx
- 2 stat cards: Shield Repaired, Life Healed
- Green color scheme

---

## Step 6: Create Main App Component

Create src/App.tsx with the following structure:

```typescript
import React, { useState } from 'react';
import { useAppData } from './hooks/useAppData';
import { useShieldSimulator } from './hooks/useShieldSimulator';
import { Header } from './components/Header';
import { ShieldStatusPanel } from './components/ShieldStatusPanel';
import { StatsGrid } from './components/StatsGrid';
import { ApplyDamagePanel } from './components/ApplyDamagePanel';
import { ActionLogPanel } from './components/ActionLogPanel';
import { HealingPanel } from './components/HealingPanel';
import { HealingStatsGrid } from './components/HealingStatsGrid';
import { CombatItemWithCategory } from './types';

function App() {
  const { data, loading, error } = useAppData();
  const [currentMode, setCurrentMode] = useState('heavy');
  const [customSavedSettings, setCustomSavedSettings] = useState(null);
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [damageInputs, setDamageInputs] = useState({ baseDamage: 40, projectiles: 1, triggers: 1 });

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

  // Implement all event handlers: handlePresetChange, handleApplyDamage, handleApplyHeal, handleCopyLog, etc.

  if (loading) return <div className="min-h-screen bg-[#15141F] text-white flex items-center justify-center">Loading...</div>;
  if (error || !data) return <div className="min-h-screen bg-[#15141F] text-white flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="text-white min-h-screen" style={{ backgroundColor: '#15141F', fontFamily: 'Inter, sans-serif' }}>
      <Header />
      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ShieldStatusPanel {...props} />
            <StatsGrid state={simulator.state} ehp={ehp} />
            <ApplyDamagePanel {...props} />
          </div>
          <div className="space-y-6">
            <ActionLogPanel {...props} />
            <HealingStatsGrid state={simulator.state} />
            <HealingPanel {...props} />
          </div>
        </div>
      </main>
      <footer className="mt-8 text-center text-xs text-gray-500 pb-4">Last Updated: {data.metadata.lastUpdated}</footer>
    </div>
  );
}

export default App;
```

---

## Step 7: Update Main Entry Point

Update src/main.tsx to add Font Awesome:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
document.head.appendChild(fontAwesomeLink);

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
```

---

## Step 8: Update Tailwind Config

Update tailwind.config.js:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: { fontFamily: { sans: ['Inter', 'sans-serif'] } },
  },
  plugins: [],
}
```

---

## Step 9: Update Global Styles

Update src/index.css:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body { margin: 0; font-family: 'Inter', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
```

---

## Step 10: Build and Run

1. npm install
2. npm run dev
3. Open browser to localhost:5173
4. Verify all functionality

---

## File Structure

```
my-react-app/
  public/
    sourceapp.json
  src/
    components/
      Header.tsx
      ProgressBar.tsx
      ShieldStatusPanel.tsx
      StatsGrid.tsx
      ApplyDamagePanel.tsx
      ActionLogPanel.tsx
      HealingPanel.tsx
      HealingStatsGrid.tsx
    hooks/
      useAppData.ts
      useShieldSimulator.ts
    types/
      index.ts
    App.tsx
    main.tsx
    index.css
  tailwind.config.js
  package.json
```

---

## Key Implementation Notes

1. Data Fetching: All data from sourceapp.json via useAppData hook
2. State Management: useShieldSimulator hook with undo/redo (50 states max)
3. Damage Calculation: Shield absorbs first, DR applies to life, durability decreases
4. Healing: Instant and over-time healing with 0.1s tick rate
5. Components: All Tailwind CSS styled, responsive design
6. TypeScript: Complete type safety with interfaces

---

## Summary

This guide provides complete instructions to build the ARC Raiders Damage Calculator in React + TypeScript with Tailwind CSS. All data is fetched from the mock API JSON file, following React best practices with proper component architecture, state management, and type safety.

Key Points:
- All data from sourceapp.json (no hardcoding)
- Complete TypeScript type definitions
- Component-based architecture
- React hooks for state management
- Tailwind CSS for all styling
- Responsive design
- Undo/Redo functionality
- Action logging
- Healing and damage systems
- Shield presets and custom configurations

End of Build Guide
