// src/types/index.ts

// Constants
export interface Constants {
  DEFAULT_MAX_LIFE: { type: string; value: number; purpose: string };
  MAX_HISTORY: { type: string; value: number; purpose: string };
}

// Shield Preset
export interface ShieldPreset {
  type?: string;  // Optional metadata field
  charges: number;
  dr: number;
  life: number;
  name: string;
  nameColor: string;
  barColor: string;
  borderColor: string;
  purpose?: string;  // Optional metadata field
}

// Shield Presets Collection
export interface ShieldPresets extends Record<string, ShieldPreset> {
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