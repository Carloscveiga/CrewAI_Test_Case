// src/components/HealingStatsGrid.tsx

interface HealingStatsGridProps {
  state: any;
}

export function HealingStatsGrid({ state }: HealingStatsGridProps) {
  const stats = [
    {
      label: 'Shield Repaired',
      value: state.shieldRepaired.toFixed(1),
      color: 'text-emerald-300',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      icon: 'fa-shield-halved',
    },
    {
      label: 'Life Healed',
      value: state.lifeHealed.toFixed(1),
      color: 'text-emerald-300',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      icon: 'fa-heart',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
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
          <div className={`text-3xl font-bold ${stat.color} group-hover:scale-105 transition-transform`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
