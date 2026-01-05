// src/components/StatsGrid.tsx

interface StatsGridProps {
  state: any;
  ehp: number;
}

export function StatsGrid({ state, ehp }: StatsGridProps) {
  const stats = [
    {
      label: 'Shots Fired',
      value: state.bulletsFired,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    },
    {
      label: 'Dmg Mitigated',
      value: state.damageMitigated.toFixed(1),
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    },
    {
      label: 'Potential Dmg',
      value: (state.damageMitigated + state.totalDamageTaken).toFixed(1),
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
    },
    {
      label: 'Current EHP',
      value: ehp.toFixed(1),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`holo-glass p-5 rounded-lg border ${stat.borderColor} transition-all duration-300 hover:scale-105 cursor-help group relative overflow-hidden`}
          style={{ animation: `fade-in 0.3s ease-out ${index * 0.1}s both` }}
          title={stat.label}
        >
          {/* Scanning line effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700"></div>

          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold font-mono">{stat.label}</span>
          </div>

          <div className={`text-2xl font-black font-mono ${stat.color} group-hover:scale-105 transition-transform duration-300 relative z-10`}>
            {stat.value}
          </div>

          {/* Corner accent markers */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{ color: stat.color.replace('text-', '') }}></div>
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{ color: stat.color.replace('text-', '') }}></div>
        </div>
      ))}
    </div>
  );
}
