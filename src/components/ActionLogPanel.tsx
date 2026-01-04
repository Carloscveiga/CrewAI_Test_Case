// src/components/ActionLogPanel.tsx
import React from 'react';
import type { LogEntry } from '../types';

interface ActionLogPanelProps {
  logs: LogEntry[];
  canUndo: boolean;
  canRedo: boolean;
  onCopyLog: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearLogs: () => void;
}

export function ActionLogPanel({ logs, canUndo, canRedo, onCopyLog, onUndo, onRedo, onClearLogs }: ActionLogPanelProps) {
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'attack': return 'fa-crosshairs';
      case 'heal': return 'fa-plus';
      case 'shield-break': return 'fa-shield-halved';
      case 'perm-break': return 'fa-shield-virus';
      case 'defeated': return 'fa-skull';
      case 'info': return 'fa-circle-info';
      case 'success': return 'fa-circle-check';
      case 'error': return 'fa-circle-exclamation';
      default: return 'fa-circle';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'attack': return 'text-red-400';
      case 'heal': return 'text-emerald-400';
      case 'shield-break': return 'text-yellow-400';
      case 'perm-break': return 'text-orange-400';
      case 'defeated': return 'text-red-400 font-bold';
      case 'info': return 'text-cyan-400';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-300';
    }
  };

  const getLogBgColor = (type: string) => {
    switch (type) {
      case 'attack': return 'bg-red-950/40 hover:bg-red-950/60 border-red-500/30';
      case 'heal': return 'bg-emerald-950/40 hover:bg-emerald-950/60 border-emerald-500/30';
      case 'shield-break': return 'bg-yellow-950/40 hover:bg-yellow-950/60 border-yellow-500/30';
      case 'perm-break': return 'bg-orange-950/40 hover:bg-orange-950/60 border-orange-500/30';
      case 'defeated': return 'bg-red-950/50 hover:bg-red-950/70 border-red-500/40';
      case 'info': return 'bg-cyan-950/40 hover:bg-cyan-950/60 border-cyan-500/30';
      case 'success': return 'bg-emerald-950/40 hover:bg-emerald-950/60 border-emerald-500/30';
      case 'error': return 'bg-red-950/40 hover:bg-red-950/60 border-red-500/30';
      default: return 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-700/50';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const copyToClipboard = () => {
    const logText = logs.map(log => `[${formatTime(log.timestamp)}] ${log.message}`).join('\n');
    navigator.clipboard.writeText(logText).then(() => {
      onCopyLog();
    });
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/20 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-clock-rotate-left text-cyan-400"></i>
            Action Log
          </h3>
          <p className="text-slate-200 text-xs mt-1">{logs.length} events logged</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClearLogs}
            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-gray-700 hover:border-red-500/50"
            title="Clear Logs"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
          <button
            onClick={copyToClipboard}
            className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200 border border-gray-700 hover:border-cyan-500/50"
            title="Copy Log"
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>

      {/* Undo/Redo buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            canUndo
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-700/30'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          <i className="fas fa-undo"></i>
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            canRedo
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-700/30'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          <i className="fas fa-redo"></i>
          Redo
        </button>
      </div>

      {/* Log entries */}
      <div className="h-80 overflow-y-auto custom-scrollbar space-y-2 p-1">
        {logs.length === 0 ? (
          <div className="text-center text-slate-400 py-12 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
              <i className="fas fa-clipboard-list text-3xl opacity-50"></i>
            </div>
            <p className="text-sm font-medium text-slate-300">No actions yet</p>
            <p className="text-xs text-slate-500">Actions will appear here as you use the calculator</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 ${getLogBgColor(log.type)}`}
            >
              <div className="mt-0.5">
                <i className={`fas ${getLogIcon(log.type)} ${getLogColor(log.type)} text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${getLogColor(log.type)} break-words`}>{log.message}</p>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <i className="fas fa-clock text-[10px]"></i>
                  {formatTime(log.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
