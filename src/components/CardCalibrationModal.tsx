import React from 'react';
import { CARD_STANDARD_HEIGHT_CM, CARD_STANDARD_WIDTH_CM } from '../types';
import { Check, ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';

interface CardCalibrationModalProps {
  ppi: number;
  onPpiChange: (newPpi: number) => void;
  onSaveAndClose: () => void;
  onClose: () => void;
  defaultPpi: number;
}

export const CardCalibrationModal: React.FC<CardCalibrationModalProps> = ({
  ppi,
  onPpiChange,
  onSaveAndClose,
  onClose,
  defaultPpi,
}) => {
  // Height in pixels on current screen scale
  const pixelsPerCm = ppi / 2.54;
  const cardHeightPx = Math.round(pixelsPerCm * CARD_STANDARD_HEIGHT_CM);
  // Full standard width
  const cardWidthPx = Math.round(pixelsPerCm * CARD_STANDARD_WIDTH_CM);

  const adjustPpi = (delta: number) => {
    const next = Math.max(40, Math.min(600, +(ppi + delta).toFixed(1)));
    onPpiChange(next);
  };

  return (
    <div
      id="card-calibration-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto touch-manipulation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="card-calibration-modal"
        className="w-full max-w-[340px] my-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-900 flex flex-col gap-3 max-h-[94dvh] overflow-y-auto border border-slate-200"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-1.5 text-base sm:text-lg font-bold text-slate-900 mb-0.5">
            <span>💳</span>
            <span>信用卡高度校準</span>
          </div>
          <p className="text-[12px] sm:text-[13px] text-slate-600 leading-snug">
            拿身邊任何一張<span className="font-semibold text-blue-600">信用卡、八達通、健保卡或悠遊卡</span>貼在螢幕上，調整藍色卡片至高度完全吻合：
          </p>
        </div>

        {/* Virtual Card Preview Container */}
        <div
          id="virtual-card-container"
          className="w-full bg-slate-100 rounded-xl p-2.5 flex items-center justify-center overflow-hidden border border-slate-200"
        >
          {/* Virtual Card Representation */}
          <div
            id="virtual-card"
            style={{
              height: `${cardHeightPx}px`,
              width: '100%',
              maxWidth: `${cardWidthPx}px`,
            }}
            className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg border-2 border-white shadow-md flex items-center justify-between px-3 text-white select-none transition-[height] duration-75"
          >
            {/* Left side chip graphic and label */}
            <div className="flex flex-col justify-between h-full py-2 pointer-events-none">
              <div className="w-7 h-5 rounded bg-amber-300/80 border border-amber-400/90 shadow-inner flex items-center justify-center">
                <div className="w-4 h-3 border-t border-b border-amber-600/50" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-blue-100 uppercase">
                  標準卡片
                </p>
                <p className="text-[9px] text-blue-200">
                  實物對齊邊界
                </p>
              </div>
            </div>

            {/* Right side clean height indicator */}
            <div className="relative flex flex-col items-center justify-between h-full py-1">
              {/* Top arrow */}
              <div className="flex items-center gap-1">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-rose-400" />
              </div>

              {/* Center height badge */}
              <div className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                高 5.40 cm
              </div>

              {/* Bottom arrow */}
              <div className="flex items-center gap-1">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-rose-400" />
              </div>

              {/* Vertical red guide line */}
              <div className="absolute top-2 bottom-2 right-1.5 w-[2px] bg-rose-400 -z-0 opacity-80" />
            </div>
          </div>
        </div>

        {/* Stepper Tuning Controls */}
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => adjustPpi(-1.5)}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-sm text-blue-700 border border-slate-300 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <ArrowDown className="w-4 h-4" />
              <span>縮小高度</span>
            </button>
            <button
              onClick={() => adjustPpi(1.5)}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-sm text-blue-700 border border-slate-300 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <ArrowUp className="w-4 h-4" />
              <span>放大高度</span>
            </button>
          </div>

          {/* Micro fine-tuning */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500">
            <button
              onClick={() => adjustPpi(-0.2)}
              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-700 font-medium active:scale-95"
            >
              微調 -0.2
            </button>
            <span className="font-mono text-[11px] text-slate-400">
              PPI: {ppi.toFixed(1)}
            </span>
            <button
              onClick={() => adjustPpi(0.2)}
              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-700 font-medium active:scale-95"
            >
              微調 +0.2
            </button>
          </div>
        </div>

        {/* Modal Action Buttons (Always visible and scrollable) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-100">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors"
          >
            跳過
          </button>
          <button
            onClick={onSaveAndClose}
            className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>完成校準</span>
          </button>
        </div>

        {/* Reset hint */}
        <div className="text-center">
          <button
            onClick={() => onPpiChange(defaultPpi)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600"
          >
            <RotateCcw className="w-3 h-3" />
            <span>還原系統預測值 ({defaultPpi.toFixed(1)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
