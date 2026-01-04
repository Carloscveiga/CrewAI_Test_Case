// src/components/ApplyDamagePanel.tsx
import { useState, useRef, useEffect } from 'react';
import type { CombatItemWithCategory } from '../types';

interface ApplyDamagePanelProps {
  combatItems: CombatItemWithCategory[];
  damageMultipliers: any;
  inputRanges: any;
  onApplyDamage: (baseDamage: number, multiplier: number, projectiles: number, triggers: number, label: string, weaponName: string) => void;
  isHitFatal: (baseDamage: number, multiplier: number, projectiles: number, triggers: number) => boolean;
  state: any;
}

export function ApplyDamagePanel({ combatItems, damageMultipliers, inputRanges, onApplyDamage, isHitFatal, state }: ApplyDamagePanelProps) {
  const [selectedWeapon, setSelectedWeapon] = useState('Anvil');
  const [customHSM, setCustomHSM] = useState(damageMultipliers?.headShot?.multiplier || 2.5);
  const [baseDamage, setBaseDamage] = useState(inputRanges?.baseDamage?.default || 40);
  const [projectiles, setProjectiles] = useState(inputRanges?.projectileCount?.default || 1);
  const [triggers, setTriggers] = useState(inputRanges?.triggerCount?.default || 1);
  const [isWeaponDropdownOpen, setIsWeaponDropdownOpen] = useState(false);
  const [weaponSearch, setWeaponSearch] = useState('');
  const weaponDropdownRef = useRef<HTMLDivElement>(null);

  const selectedWeaponItem = combatItems.find(item => item.name === selectedWeapon);
  const currentHSM = selectedWeaponItem?.item.hsm || customHSM;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (weaponDropdownRef.current && !weaponDropdownRef.current.contains(event.target as Node)) {
        setIsWeaponDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredWeapons = combatItems.filter(item =>
    item.name.toLowerCase().includes(weaponSearch.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weapon': return 'fa-gun';
      case 'gadget': return 'fa-bomb';
      case 'deployable': return 'fa-robot';
      default: return 'fa-box';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weapon': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'gadget': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'deployable': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const isDefeated = state.currentLife <= 0;
  const isLegShotFatal = isHitFatal(baseDamage, damageMultipliers?.legShot?.multiplier || 0.75, projectiles, triggers);
  const isBodyShotFatal = isHitFatal(baseDamage, damageMultipliers?.bodyShot?.multiplier || 1, projectiles, triggers);
  const isHeadShotFatal = isHitFatal(baseDamage, currentHSM, projectiles, triggers);

  const handleShot = (multiplier: number, label: string) => {
    onApplyDamage(baseDamage, multiplier, projectiles, triggers, label, selectedWeapon);
  };

  return (
    <div className={`glass rounded-2xl p-6 shadow-2xl shadow-black/20 border border-border/50 transition-all duration-300 ${isDefeated ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-crosshairs text-red-300"></i>
          Apply Damage
        </h3>
        <p className="text-slate-200 text-xs mt-1">Test damage against your shield</p>
      </div>

      {/* Modern Weapon Selector */}
      <div className="mb-5" ref={weaponDropdownRef}>
        <label className="block text-sm text-slate-200 font-medium mb-2 flex items-center gap-2">
          <i className="fas fa-gun text-xs"></i>
          Weapon Preset
        </label>

        {/* Custom Dropdown Button */}
        <button
          onClick={() => setIsWeaponDropdownOpen(!isWeaponDropdownOpen)}
          className="w-full px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-600 hover:border-cyan-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none cursor-pointer flex items-center justify-between group hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${getCategoryColor(selectedWeaponItem?.category || 'weapon')} flex items-center justify-center`}>
              <i className={`fas ${getCategoryIcon(selectedWeaponItem?.category || 'weapon')} text-sm`}></i>
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">{selectedWeapon}</div>
              <div className="text-xs text-slate-400">
                {selectedWeaponItem?.item.damage} DMG
                {selectedWeaponItem?.item.hsm && `, ${selectedWeaponItem.item.hsm}x HSM`}
                {selectedWeaponItem?.item.projectiles && selectedWeaponItem.item.projectiles > 1 && `, ${selectedWeaponItem.item.projectiles} Proj`}
              </div>
            </div>
          </div>
          <i className={`fas fa-chevron-down transition-transform duration-200 ${isWeaponDropdownOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {/* Custom Dropdown Menu */}
        {isWeaponDropdownOpen && (
          <div className="mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl shadow-black/50 overflow-hidden z-50">
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-700">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search weapons..."
                  value={weaponSearch}
                  onChange={(e) => setWeaponSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Weapon List with Custom Scrollbar */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {filteredWeapons.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">
                  <i className="fas fa-search text-2xl mb-2 opacity-50"></i>
                  <p>No weapons found</p>
                </div>
              ) : (
                filteredWeapons.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedWeapon(item.name);
                      setIsWeaponDropdownOpen(false);
                      setWeaponSearch('');
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-150 border-l-2 ${
                      selectedWeapon === item.name
                        ? 'bg-cyan-500/10 border-cyan-500'
                        : 'bg-transparent border-transparent hover:bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${getCategoryColor(item.category)} flex items-center justify-center flex-shrink-0`}>
                      <i className={`fas ${getCategoryIcon(item.category)} text-sm`}></i>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className={`font-medium truncate ${selectedWeapon === item.name ? 'text-cyan-400' : 'text-slate-200'}`}>
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{item.item.damage} DMG</span>
                        {item.item.hsm && <span className="text-amber-400">• {item.item.hsm}x HSM</span>}
                        {item.item.projectiles && item.item.projectiles > 1 && <span className="text-purple-400">• {item.item.projectiles} Proj</span>}
                      </div>
                    </div>
                    {selectedWeapon === item.name && (
                      <i className="fas fa-check text-cyan-400 flex-shrink-0"></i>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer with count */}
            <div className="p-2 bg-gray-800/50 border-t border-gray-700 text-xs text-slate-500 text-center">
              {filteredWeapons.length} {filteredWeapons.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        )}
      </div>

      {/* Custom headshot multiplier input */}
      {selectedWeaponItem?.item.hsm === undefined && (
        <div className="mb-5">
          <label className="block text-sm text-slate-200 font-medium mb-2 flex items-center gap-2">
            <i className="fas fa-sliders-h text-xs"></i>
            Custom Headshot Multiplier
          </label>
          <input
            type="number"
            value={customHSM}
            onChange={(e) => setCustomHSM(parseFloat(e.target.value) || 0)}
            min={inputRanges?.headshotMultiplier?.min || 0}
            max={inputRanges?.headshotMultiplier?.max || 100}
            step={inputRanges?.headshotMultiplier?.step || 0.05}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 hover:border-cyan-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>
      )}

      {/* Damage inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div>
          <label className="block text-sm text-slate-200 font-medium mb-2">Base Damage</label>
          <input
            type="number"
            value={baseDamage}
            onChange={(e) => setBaseDamage(parseFloat(e.target.value) || 0)}
            min={inputRanges?.baseDamage?.min || 0.1}
            max={inputRanges?.baseDamage?.max || 10000}
            step={inputRanges?.baseDamage?.step || 0.1}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 hover:border-cyan-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-200 font-medium mb-2">Projectiles</label>
          <input
            type="number"
            value={projectiles}
            onChange={(e) => setProjectiles(parseInt(e.target.value) || 1)}
            min={inputRanges?.projectileCount?.min || 1}
            max={inputRanges?.projectileCount?.max || 100}
            step={inputRanges?.projectileCount?.step || 1}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 hover:border-cyan-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-200 font-medium mb-2">Trigger Pulls</label>
          <input
            type="number"
            value={triggers}
            onChange={(e) => setTriggers(parseInt(e.target.value) || 1)}
            min={inputRanges?.triggerCount?.min || 1}
            max={inputRanges?.triggerCount?.max || 10000}
            step={inputRanges?.triggerCount?.step || 1}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 hover:border-cyan-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Current HSM display */}
      <div className="mb-5 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-200 font-medium">Current Headshot Multiplier</span>
          <span className={`text-lg font-bold ${isHeadShotFatal ? 'text-red-400' : 'text-cyan-400'}`}>
            {currentHSM}x
          </span>
        </div>
      </div>

      {/* Shot buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleShot(damageMultipliers?.legShot?.multiplier || 0.75, damageMultipliers?.legShot?.label || 'Leg Shot')}
          disabled={isDefeated}
          className={`py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isLegShotFatal
              ? 'bg-gradient-to-r from-red-900 via-red-800 to-red-900 hover:from-red-950 hover:via-red-900 hover:to-red-950 border-2 border-red-500 text-white hover:bg-red-950 shadow-lg shadow-red-500/40'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border border-emerald-400/40 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-600/40'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLegShotFatal ? <i className="fas fa-skull animate-pulse text-lg"></i> : <i className="fas fa-shoe-prints"></i>}
          Leg Shot
        </button>
        <button
          onClick={() => handleShot(damageMultipliers?.bodyShot?.multiplier || 1, damageMultipliers?.bodyShot?.label || 'Body Shot')}
          disabled={isDefeated}
          className={`py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isBodyShotFatal
              ? 'bg-gradient-to-r from-red-900 via-red-800 to-red-900 hover:from-red-950 hover:via-red-900 hover:to-red-950 border-2 border-red-500 text-white hover:bg-red-950 shadow-lg shadow-red-500/40'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border border-blue-400/40 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-600/40'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isBodyShotFatal ? <i className="fas fa-skull animate-pulse text-lg"></i> : <i className="fas fa-bullseye"></i>}
          Body Shot
        </button>
        <button
          onClick={() => handleShot(currentHSM, 'Head Shot')}
          disabled={isDefeated}
          className={`py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isHeadShotFatal
              ? 'bg-gradient-to-r from-red-900 via-red-800 to-red-900 hover:from-red-950 hover:via-red-900 hover:to-red-950 border-2 border-red-500 text-white hover:bg-red-950 shadow-lg shadow-red-500/40'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border border-pink-400/40 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-600/40'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isHeadShotFatal ? <i className="fas fa-skull animate-pulse text-lg"></i> : <i className="fas fa-skull"></i>}
          Head Shot
        </button>
      </div>
    </div>
  );
}
