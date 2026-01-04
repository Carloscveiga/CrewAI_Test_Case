// src/hooks/useShieldSimulator.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import type { SimulatorState, DamageResult, StateSnapshot, LogEntry, LogType, ShieldPreset } from '../types';

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

  // Use refs to access current state without triggering dependency changes
  const stateRef = useRef(state);
  const logsRef = useRef(logs);

  // Update refs whenever state or logs change
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);

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

  // Fixed: saveState uses refs to avoid circular dependency
  const saveState = useCallback(() => {
    const currentState = stateRef.current;
    const currentLogs = logsRef.current;

    const snapshot: StateSnapshot = {
      currentShield: currentState.currentShield,
      currentLife: currentState.currentLife,
      currentDurability: currentState.currentDurability,
      isPermanentlyBroken: currentState.isPermanentlyBroken,
      bulletsFired: currentState.bulletsFired,
      damageMitigated: currentState.damageMitigated,
      totalDamageTaken: currentState.totalDamageTaken,
      shieldRepaired: currentState.shieldRepaired,
      lifeHealed: currentState.lifeHealed,
      logHTML: JSON.stringify(currentLogs),
    };

    setActionHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(snapshot);
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, maxHistory - 1));
  }, [historyIndex, maxHistory]);

  const applyPreset = useCallback((preset: ShieldPreset) => {
    const newState: SimulatorState = {
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
    };

    clearLogs();
    setState(newState);
    addLog(`Initialized with ${preset.name}`, 'info');

    // Reset and save initial state
    const snapshot: StateSnapshot = {
      currentShield: preset.charges,
      currentLife: preset.life,
      currentDurability: preset.charges,
      isPermanentlyBroken: false,
      bulletsFired: 0,
      damageMitigated: 0,
      totalDamageTaken: 0,
      shieldRepaired: 0,
      lifeHealed: 0,
      logHTML: '[]',
    };
    setActionHistory([snapshot]);
    setHistoryIndex(0);
  }, [clearLogs, addLog]);

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

    // Log after state update (in next render cycle)
    setTimeout(() => {
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
    }, 0);
  }, [addLog, saveState]);

  const isHitFatal = useCallback((baseDamage: number, multiplier: number, projectiles: number, triggers: number): boolean => {
    const currentState = stateRef.current;
    let tempShield = currentState.currentShield;
    let tempDurability = currentState.currentDurability;
    let tempLife = currentState.currentLife;
    let tempBroken = currentState.isPermanentlyBroken;

    for (let t = 0; t < triggers; t++) {
      for (let p = 0; p < projectiles; p++) {
        if (tempShield > 0 && !tempBroken) {
          const damageToShield = Math.min(tempShield, baseDamage);
          tempShield -= damageToShield;
          tempDurability -= damageToShield;
          if (tempDurability <= 0) tempBroken = true;
          const mitigatedBase = baseDamage * (1 - currentState.dr / 100);
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
  }, []);

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
    setTimeout(() => saveState(), 0);
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
    const currentState = stateRef.current;
    const effectivePool = Math.max(0, currentState.currentLife - 0.5);
    const damageFactor = 1 - (currentState.dr / 100);
    if (currentState.currentShield > 0 && !currentState.isPermanentlyBroken) {
      return effectivePool / damageFactor;
    }
    return effectivePool;
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const snapshot = actionHistory[newIndex];
      setState(prev => ({
        ...prev,
        currentShield: snapshot.currentShield,
        currentLife: snapshot.currentLife,
        currentDurability: snapshot.currentDurability,
        isPermanentlyBroken: snapshot.isPermanentlyBroken,
        bulletsFired: snapshot.bulletsFired,
        damageMitigated: snapshot.damageMitigated,
        totalDamageTaken: snapshot.totalDamageTaken,
        shieldRepaired: snapshot.shieldRepaired,
        lifeHealed: snapshot.lifeHealed,
      }));
      try {
        const parsedLogs = JSON.parse(snapshot.logHTML);
        // Convert timestamp strings back to Date objects
        const restoredLogs = parsedLogs.map((log: LogEntry) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setLogs(restoredLogs);
      } catch {
        setLogs([]);
      }
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, actionHistory]);

  const redo = useCallback(() => {
    if (historyIndex < actionHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const snapshot = actionHistory[newIndex];
      setState(prev => ({
        ...prev,
        currentShield: snapshot.currentShield,
        currentLife: snapshot.currentLife,
        currentDurability: snapshot.currentDurability,
        isPermanentlyBroken: snapshot.isPermanentlyBroken,
        bulletsFired: snapshot.bulletsFired,
        damageMitigated: snapshot.damageMitigated,
        totalDamageTaken: snapshot.totalDamageTaken,
        shieldRepaired: snapshot.shieldRepaired,
        lifeHealed: snapshot.lifeHealed,
      }));
      try {
        const parsedLogs = JSON.parse(snapshot.logHTML);
        // Convert timestamp strings back to Date objects
        const restoredLogs = parsedLogs.map((log: LogEntry) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setLogs(restoredLogs);
      } catch {
        setLogs([]);
      }
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, actionHistory]);

  return {
    state, logs, canUndo: historyIndex > 0, canRedo: historyIndex < actionHistory.length - 1,
    applyPreset, applyDamage, healInstant, startOverTimeHeal, clearActiveHeals, calculateEHP, isHitFatal, undo, redo, clearLogs, addLog,
    updateCustomSettings: useCallback((settings: Partial<SimulatorState>) => setState(prev => ({ ...prev, ...settings })), []),
  };
}
