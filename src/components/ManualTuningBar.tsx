import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface ManualTuningBarProps {
  ppi: number;
  onPpiChange: (newPpi: number) => void;
  onClose: () => void;
  defaultPpi: number;
}

export const ManualTuningBar: React.FC<ManualTuningBarProps> = ({
  ppi,
  onPpiChange,
  defaultPpi,
}) => {
  const [inputValue, setInputValue] = useState(ppi.toFixed(1));
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (!isFocusedRef.current) {
      setInputValue(ppi.toFixed(1));
    }
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
    isFocusedRef.current = false;
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
      className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl shadow-lg px-2 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-1.5 text-slate-800 pointer-events-auto select-none max-w-full"
    >
      <div className="flex items-center gap-0.5">
        <span className="text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap">
          比例
        </span>
      </div>

      {/* Minus Button */}
      <button
        onClick={() => adjust(-0.5)}
        className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center border border-slate-200 text-slate-800 transition-colors cursor-pointer shrink-0"
        title="縮小 0.5 PPI"
        aria-label="縮小 0.5 PPI"
      >
        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* Number Input Box */}
      <div className="relative flex items-center gap-0.5">
        <input
          type="number"
          id="ppi-direct-input"
          inputMode="decimal"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            isFocusedRef.current = true;
            setInputValue('');
          }}
          onClick={() => {
            if (inputValue !== '') {
              setInputValue('');
            }
          }}
          onBlur={handleBlur}
          step="0.1"
          min="30"
          max="800"
          className="w-[48px] sm:w-[52px] text-center font-mono font-bold text-xs bg-slate-50 border border-slate-300 rounded-md py-0.5 px-0.5 text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-colors"
          title="手動輸入 PPI 比例"
          aria-label="PPI 比例"
        />
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mr-0.5">
          PPI
        </span>
      </div>

      {/* Plus Button */}
      <button
        onClick={() => adjust(0.5)}
        className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center border border-slate-200 text-slate-800 transition-colors cursor-pointer shrink-0"
        title="放大 0.5 PPI"
        aria-label="放大 0.5 PPI"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* Reset to suggested baseline */}
      <button
        onClick={() => onPpiChange(defaultPpi)}
        className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center border border-slate-200 text-slate-800 transition-colors cursor-pointer shrink-0"
        title={`重設為建議值 (${defaultPpi.toFixed(1)})`}
        aria-label="重設建議比例"
      >
        <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
      </button>
    </div>
  );
};
