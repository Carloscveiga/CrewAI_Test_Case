// src/components/ProgressBar.tsx

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  label: string;
  valueLabel?: string;
  prediction?: number;
  showDefeated?: boolean;
}

export function ProgressBar({ value, max, color, label, valueLabel, prediction, showDefeated }: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const predictionPercentage = prediction !== undefined && max > 0 ? (prediction / max) * 100 : 0;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-bold text-white">{valueLabel || `${value.toFixed(1)} / ${max}`}</span>
      </div>
      <div className="relative h-6 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        {/* Main progress bar */}
        <div
          className={`h-full transition-all duration-300 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Prediction overlay */}
        {prediction !== undefined && prediction > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-red-500/30 transition-all duration-200"
            style={{ width: `${predictionPercentage}%` }}
          />
        )}
        {/* Defeated overlay */}
        {showDefeated && (
          <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
            <span className="text-white font-bold text-sm uppercase tracking-wider">Defeated</span>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1 text-right">{percentage.toFixed(1)}%</div>
    </div>
  );
}