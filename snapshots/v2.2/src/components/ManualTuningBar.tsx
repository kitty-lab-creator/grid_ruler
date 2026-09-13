import React, { useState, useEffect } from 'react';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';

interface ManualTuningBarProps {
  ppi: number;
  onPpiChange: (newPpi: number) => void;
  onClose: () => void;
  defaultPpi: number;
}

export const ManualTuningBar: React.FC<ManualTuningBarProps> = ({
  ppi,
  onPpiChange,
  onClose,
  defaultPpi,
}) => {
  const [inputValue, setInputValue] = useState(ppi.toFixed(1));

  useEffect(() => {
    setInputValue(ppi.toFixed(1));
  }, [ppi]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 30 && parsed <= 800) {
      onPpiChange(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed) || parsed < 30 || parsed > 800) {
      setInputValue(ppi.toFixed(1));
    } else {
      onPpiChange(parsed);
    }
  };

  const adjust = (delta: number) => {
    const next = Math.max(30, Math.min(800, +(ppi + delta).toFixed(1)));
    onPpiChange(next);
  };

  return (
    <div
      id="manual-tuning-bar"
      className="fixed left-3.5 z-40 max-w-[calc(100vw-70px)] sm:max-w-md bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl shadow-lg px-3 py-1.5 flex items-center gap-2 text-slate-800 pointer-events-auto select-none"
      style={{ top: 'calc(14px + env(safe-area-inset-top, 0px))' }}
    >
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
          比例
        </span>
      </div>

      {/* Minus Button */}
      <button
        onClick={() => adjust(-0.5)}
        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center border border-slate-200 text-slate-800 transition-colors cursor-pointer"
        title="縮小 0.5 PPI"
        aria-label="縮小 0.5 PPI"
      >
        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* Number Input Box */}
      <div className="relative flex items-center">
        <input
          type="number"
          id="ppi-direct-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          step="0.1"
          min="30"
          max="800"
          className="w-16 sm:w-20 text-center font-mono font-bold text-sm bg-slate-50 border border-slate-300 rounded-lg py-1 px-1 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="ml-1 text-[11px] text-slate-500 font-semibold hidden xs:inline">
          PPI
        </span>
      </div>

      {/* Plus Button */}
      <button
        onClick={() => adjust(0.5)}
        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center border border-slate-200 text-slate-800 transition-colors cursor-pointer"
        title="放大 0.5 PPI"
        aria-label="放大 0.5 PPI"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* Reset to suggested baseline */}
      <button
        onClick={() => onPpiChange(defaultPpi)}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
        title={`重設為建議值 (${defaultPpi.toFixed(1)})`}
        aria-label="重設建議比例"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        title="關閉微調列"
        aria-label="關閉微調列"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
