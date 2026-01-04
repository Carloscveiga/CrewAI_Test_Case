// src/components/StatsGrid.tsx
import React from 'react';

interface StatsGridProps {
  state: any;
  ehp: number;
}

export function StatsGrid({ state, ehp }: StatsGridProps) {
  const stats = [
    {
      label: 'Shots Fired',
      value: state.bulletsFired,
      color: 'text-amber-300',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: 'fa-crosshairs',
    },
    {
      label: 'Dmg Mitigated',
      value: state.damageMitigated.toFixed(1),
      color: 'text-cyan-300',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      icon: 'fa-shield-halved',
    },
    {
      label: 'Potential Dmg',
      value: (state.damageMitigated + state.totalDamageTaken).toFixed(1),
      color: 'text-red-300',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      icon: 'fa-fire',
    },
    {
      label: 'Current EHP',
      value: ehp.toFixed(1),
      color: 'text-violet-300',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      icon: 'fa-heart',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`glass p-5 rounded-xl border ${stat.borderColor} shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105 cursor-help group`}
          title={stat.label}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <i className={`fas ${stat.icon} ${stat.color} text-sm`}></i>
            </div>
            <span className="text-xs text-slate-200 uppercase tracking-wider font-semibold">{stat.label}</span>
          </div>
          <div className={`text-2xl font-bold ${stat.color} group-hover:scale-105 transition-transform`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
