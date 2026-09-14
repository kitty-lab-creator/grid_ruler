import React from 'react';
import { Ruler, CreditCard, Sliders, ChevronUp, ChevronDown } from 'lucide-react';
import { Unit, GuideMode } from '../types';

interface RightToolbarProps {
  unit: Unit;
  onToggleUnit: () => void;
  guideMode: GuideMode;
  onToggleGuides: () => void;
  onCycleBgColor: () => void;
  onOpenCardSync: () => void;
  isManualTuningOpen: boolean;
  onToggleManualTuning: () => void;
  onOpenInfo: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const RightToolbar: React.FC<RightToolbarProps> = ({
  unit,
  onToggleUnit,
  guideMode,
  onToggleGuides,
  onCycleBgColor,
  onOpenCardSync,
  isManualTuningOpen,
  onToggleManualTuning,
  onOpenInfo,
  isCollapsed,
  onToggleCollapse,
}) => {
  // If collapsed: only show the expand button (ChevronDown) at top right
  if (isCollapsed) {
    return (
      <div
        className="fixed right-3.5 z-30 pointer-events-auto"
        style={{ top: 'calc(14px + env(safe-area-inset-top, 0px))' }}
      >
        <button
          id="btn-expand-toolbar"
          onClick={onToggleCollapse}
          className="w-11 h-9 bg-white/95 text-slate-800 border border-slate-300 shadow-md rounded-xl flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
          title="展開控制選單"
          aria-label="展開控制選單"
        >
          <ChevronDown className="w-5 h-5 text-slate-700 stroke-[2.5]" />
        </button>
      </div>
    );
  }

  // Expanded vertical stack
  return (
    <div
      id="right-toolbar"
      className="fixed right-3.5 z-30 flex flex-col items-center gap-2.5 pointer-events-auto select-none"
      style={{ top: 'calc(14px + env(safe-area-inset-top, 0px))' }}
    >
      {/* 1. Unit toggle: in/cm exchange */}
      <button
        id="btn-unit-exchange"
        onClick={onToggleUnit}
        className="w-11 h-11 rounded-full bg-white/95 text-slate-800 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all cursor-pointer"
        title={`切換單位 (目前: ${unit === 'cm' ? '公分' : '英吋'})`}
        aria-label="單位切換"
      >
        <span className="text-[12px] font-bold tracking-tight text-slate-800">
          {unit === 'cm' ? 'in/cm' : 'cm/in'}
        </span>
      </button>

      {/* 2. Reference Line toggle: 3-mode switch (all -> lines -> off) */}
      <button
        id="btn-reference-line"
        onClick={onToggleGuides}
        className={`w-11 h-11 rounded-full border shadow-md flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
          guideMode === 'all'
            ? 'bg-red-600 text-white border-red-700 shadow-red-500/35'
            : guideMode === 'lines'
            ? 'bg-red-600 text-white border-red-700 shadow-red-500/35 ring-2 ring-white ring-offset-2 ring-offset-red-500'
            : 'bg-white/95 text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
        title={
          guideMode === 'all'
            ? '參考線與控制列 (點擊隱藏控制列，僅保留標線)'
            : guideMode === 'lines'
            ? '僅顯示參考線 (點擊完全關閉)'
            : '開啟參考線與控制列'
        }
        aria-label="參考線模式切換"
      >
        <Ruler className="w-5 h-5 stroke-[2]" />
      </button>

      {/* 3. Background Color: Color palette wheel icon */}
      <button
        id="btn-bg-color"
        onClick={onCycleBgColor}
        className="w-11 h-11 rounded-full bg-white/95 text-slate-700 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all cursor-pointer"
        title="切換背景顏色 (白、Tajima 捲尺黃、50% 灰、深黑)"
        aria-label="切換背景顏色"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 7.79 4.5" stroke="#ef4444" strokeWidth="2.5" />
          <path d="M19.79 7.5A9 9 0 0 1 21 12" stroke="#eab308" strokeWidth="2.5" />
          <path d="M21 12a9 9 0 0 1-4.5 7.79" stroke="#22c55e" strokeWidth="2.5" />
          <path d="M16.5 19.79A9 9 0 0 1 12 21" stroke="#06b6d4" strokeWidth="2.5" />
          <path d="M12 21a9 9 0 0 1-7.79-4.5" stroke="#3b82f6" strokeWidth="2.5" />
          <path d="M4.21 16.5A9 9 0 0 1 3 12" stroke="#8b5cf6" strokeWidth="2.5" />
          <path d="M3 12a9 9 0 0 1 9-9" stroke="#ec4899" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        </svg>
      </button>

      {/* 4. Card Sync: Credit Card icon */}
      <button
        id="btn-card-sync"
        onClick={onOpenCardSync}
        className="w-11 h-11 rounded-full bg-white/95 text-slate-700 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all cursor-pointer"
        title="實體卡片校準"
        aria-label="實體卡片校準"
      >
        <CreditCard className="w-5 h-5 text-blue-600 stroke-[2]" />
      </button>

      {/* 5. Manual Tuning: Sliders icon */}
      <button
        id="btn-manual-tuning"
        onClick={onToggleManualTuning}
        className={`w-11 h-11 rounded-full border shadow-md flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
          isManualTuningOpen
            ? 'bg-blue-600 text-white border-blue-700 shadow-blue-500/35'
            : 'bg-white/95 text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
        title="手動 PPI 比例微調"
        aria-label="手動 PPI 比例微調"
      >
        <Sliders className="w-5 h-5 stroke-[2]" />
      </button>

      {/* 6. Information: "?" icon */}
      <button
        id="btn-info"
        onClick={onOpenInfo}
        className="w-11 h-11 rounded-full bg-white/95 text-slate-700 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all cursor-pointer"
        title="使用說明與聯絡作者"
        aria-label="使用說明與作者"
      >
        <span className="text-base font-bold text-slate-800">?</span>
      </button>

      {/* 7. Collapse toggle: ChevronUp in rounded rect */}
      <button
        id="btn-collapse-toolbar"
        onClick={onToggleCollapse}
        className="w-11 h-9 bg-white/95 text-slate-700 border border-slate-300 shadow-md rounded-xl flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all cursor-pointer mt-0.5"
        title="收起控制按鈕"
        aria-label="收起控制按鈕"
      >
        <ChevronUp className="w-5 h-5 text-slate-700 stroke-[2.5]" />
      </button>
    </div>
  );
};
