import React from 'react';
import { CARD_STANDARD_HEIGHT_CM, CARD_STANDARD_WIDTH_CM } from '../types';
import { Check, ArrowDown, ArrowUp, RotateCcw, X } from 'lucide-react';

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
  // Height in pixels on current screen scale (ID-1 card standard height is 5.398 cm / 53.98 mm)
  const pixelsPerCm = ppi / 2.54;
  const cardHeightPx = Math.round(pixelsPerCm * CARD_STANDARD_HEIGHT_CM);
  const cardWidthPx = Math.round(pixelsPerCm * CARD_STANDARD_WIDTH_CM);

  const adjustPpi = (delta: number) => {
    const next = Math.max(40, Math.min(600, +(ppi + delta).toFixed(1)));
    onPpiChange(next);
  };

  return (
    <div
      id="card-calibration-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto select-none touch-manipulation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="card-calibration-modal"
        className="relative w-full max-w-[340px] my-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-900 flex flex-col gap-3 max-h-[92dvh] overflow-y-auto border border-slate-200"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Top-Right Circular Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors z-10 cursor-pointer"
          title="跳過並關閉"
          aria-label="跳過並關閉"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pr-6">
          <div className="inline-flex items-center justify-center gap-1.5 text-base sm:text-lg font-bold text-slate-900 mb-0.5">
            <span>💳</span>
            <span>信用卡高度校準</span>
          </div>
          <p className="text-[12px] text-slate-600 leading-snug">
            將任何一張<span className="font-semibold text-blue-600">信用卡、八達通或健保卡</span>貼在螢幕上，微調至高度完全吻合：
          </p>
        </div>

        {/* Virtual Card Preview Container */}
        <div
          id="virtual-card-container"
          className="w-full bg-slate-50 rounded-xl p-2.5 flex items-center justify-center overflow-hidden border border-slate-200 min-h-[140px]"
        >
          {/* Virtual Card Representation */}
          <div
            id="virtual-card"
            style={{
              height: `${cardHeightPx}px`,
              width: '100%',
              maxWidth: `${cardWidthPx}px`,
              background: '#090d16',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.02) 5%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.9) 70%, #000 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.02) 5%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.9) 70%, #000 100%)',
              borderRadius: '0 10px 10px 0',
            }}
            className="relative flex items-center justify-between text-white select-none transition-[height] duration-75 overflow-hidden"
          >
            {/* Subtle watermark markings on the left */}
            <div className="flex flex-col justify-between h-3/4 pl-5 opacity-35 pointer-events-none">
              <span className="text-[11px] font-semibold tracking-wider text-slate-200">Bank Card</span>
              <span className="font-mono text-[11px] tracking-widest text-slate-200">•••• •••• •••• 3456</span>
            </div>

            {/* Right edge sharp red alignment arrow and badge */}
            <div className="absolute right-2 top-0 bottom-0 w-[145px] flex flex-col items-end justify-between pointer-events-none">
              {/* Top Cap & Downward Arrowhead */}
              <svg width="24" height="14" viewBox="0 0 24 14" className="mr-[1px]">
                <line x1="2" y1="1.5" x2="22" y2="1.5" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                <path d="M5 2 L12 10 L19 2" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Vertical Connecting Line & Center Red Badge */}
              <div className="flex-1 w-6 relative flex items-center justify-center">
                <div className="absolute top-0 bottom-0 w-[2.5px] bg-red-500"></div>
                <div className="absolute right-7 bg-red-600 text-white font-bold text-[11px] px-2 py-0.5 rounded shadow whitespace-nowrap border border-white/20">
                  對齊真實卡片高度
                </div>
              </div>

              {/* Bottom Cap & Upward Arrowhead */}
              <svg width="24" height="14" viewBox="0 0 24 14" className="mr-[1px]">
                <path d="M5 12 L12 4 L19 12" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="2" y1="12.5" x2="22" y2="12.5" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stepper Tuning Controls */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => adjustPpi(-1.5)}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-sm text-slate-800 border border-slate-300 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowDown className="w-4 h-4 text-blue-600" />
            <span>▼ 縮小高度</span>
          </button>
          <button
            onClick={() => adjustPpi(1.5)}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-sm text-slate-800 border border-slate-300 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 text-blue-600" />
            <span>▲ 放大高度</span>
          </button>
        </div>

        {/* Modal Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
          >
            跳過
          </button>
          <button
            onClick={onSaveAndClose}
            className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>完成校準 ✓</span>
          </button>
        </div>

        {/* Reset Option */}
        <div className="text-center pt-0.5">
          <button
            onClick={() => {
              onPpiChange(defaultPpi);
            }}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>還原系統預測比例 ({defaultPpi.toFixed(1)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
