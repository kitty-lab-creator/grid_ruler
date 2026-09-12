import React from 'react';
import { Ruler, CreditCard, Sliders, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Unit } from '../types';

interface RightToolbarProps {
  unit: Unit;
  onToggleUnit: () => void;
  showGuides: boolean;
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
  showGuides,
  onToggleGuides,
  onCycleBgColor,
  onOpenCardSync,
  isManualTuningOpen,
  onToggleManualTuning,
  onOpenInfo,
  isCollapsed,
  onToggleCollapse,
}) => {
  // If collapsed, only the upside-down triangle inside a rectangle button is shown at the top-right corner
  if (isCollapsed) {
    return (
      <div className="fixed top-3 right-3 z-30 pointer-events-auto">
        <button
          id="btn-expand-toolbar"
          onClick={onToggleCollapse}
          className="w-11 h-9 bg-white/95 text-slate-800 border border-slate-300 shadow-md rounded-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
          title="展開控制按鈕"
          aria-label="展開控制按鈕"
        >
          {/* Upside down triangle (▼) */}
          <ChevronDown className="w-5 h-5 text-slate-700 stroke-[2.5]" />
        </button>
      </div>
    );
  }

  // Expanded state: vertical column of circle buttons from top-right down towards bottom-right, ending with upside triangle in rectangle button
  return (
    <div
      id="right-toolbar"
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-30 flex flex-col items-center gap-2.5 pointer-events-auto"
    >
      {/* 1. Unit toggle: in/cm exchange */}
      <button
        id="btn-unit-exchange"
        onClick={onToggleUnit}
        className="w-11 h-11 rounded-full bg-white/95 text-slate-800 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
        title={`切換單位 (目前: ${unit === 'cm' ? '公分' : '英吋'})`}
        aria-label="單位切換"
      >
        <span className="text-[12px] font-bold tracking-tight text-slate-800 select-none">
          {unit === 'cm' ? 'in/cm' : 'cm/in'}
        </span>
      </button>

      {/* 2. Reference Line toggle: Ruler icon, becomes red when active */}
      <button
        id="btn-reference-line"
        onClick={onToggleGuides}
        className={`w-11 h-11 rounded-full border shadow-md flex items-center justify-center active:scale-95 transition-all ${
          showGuides
            ? 'bg-red-600 text-white border-red-700 shadow-red-500/30'
            : 'bg-white/95 text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
        title="參考線開關"
        aria-label="參考線開關"
      >
        <Ruler className="w-5 h-5" />
      </button>

      {/* 3. Background Color: Color wheel icon, cycles yellow -> grey -> black -> white */}
      <button
        id="btn-bg-color"
        onClick={onCycleBgColor}
        className="w-11 h-11 rounded-full bg-white/95 text-slate-700 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all group"
        title="切換背景顏色 (黃、灰、黑、白)"
        aria-label="切換背景顏色"
      >
        {/* Color Wheel SVG icon */}
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
        className="w-11 h-11 rounded-full bg-white/95 text-slate-700 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
        title="實體卡片校準"
        aria-label="實體卡片校準"
      >
        <CreditCard className="w-5 h-5 text-blue-600" />
      </button>

      {/* 5. Manual Tuning: Sliders icon */}
      <button
        id="btn-manual-tuning"
        onClick={onToggleManualTuning}
        className={`w-11 h-11 rounded-full border shadow-md flex items-center justify-center active:scale-95 transition-all ${
          isManualTuningOpen
            ? 'bg-blue-600 text-white border-blue-700 shadow-blue-500/30'
            : 'bg-white/95 text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
        title="手動數值微調"
        aria-label="手動數值微調"
      >
        <Sliders className="w-5 h-5" />
      </button>

      {/* 6. Information: "?" icon */}
      <button
        id="btn-info"
        onClick={onOpenInfo}
        className="w-11 h-11 rounded-full bg-white/95 text-slate-700 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
        title="使用說明與聯絡作者"
        aria-label="使用說明與作者"
      >
        <HelpCircle className="w-5 h-5 text-slate-700" />
      </button>

      {/* 7. Collapse toggle: Upside triangle in a rectangle button (▲) */}
      <button
        id="btn-collapse-toolbar"
        onClick={onToggleCollapse}
        className="w-11 h-9 bg-white/95 text-slate-700 border border-slate-300 shadow-md rounded-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all mt-1"
        title="收起按鈕節省畫面空間"
        aria-label="收起控制按鈕"
      >
        {/* Upside triangle (▲) */}
        <ChevronUp className="w-5 h-5 text-slate-700 stroke-[2.5]" />
      </button>
    </div>
  );
};
