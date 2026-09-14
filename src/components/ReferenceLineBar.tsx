import React, { useState, useEffect, useRef } from 'react';
import { Unit } from '../types';
import { Link2, Link2Off, Lock, Unlock } from 'lucide-react';

interface ReferenceLineBarProps {
  unit: Unit;
  ppi: number;
  guideX: number; // in pixels
  guideY: number; // in pixels
  onGuideChange: (x: number, y: number) => void;
  isPositionLocked: boolean;
  onTogglePositionLock: () => void;
  isRatioLocked: boolean;
  onToggleRatioLock: () => void;
  lockedRatio: number | null;
}

export const ReferenceLineBar: React.FC<ReferenceLineBarProps> = ({
  unit,
  ppi,
  guideX,
  guideY,
  onGuideChange,
  isPositionLocked,
  onTogglePositionLock,
  isRatioLocked,
  onToggleRatioLock,
  lockedRatio,
}) => {
  const pixelsPerUnit = unit === 'cm' ? ppi / 2.54 : ppi;
  const currentValX = guideX / pixelsPerUnit;
  const currentValY = guideY / pixelsPerUnit;

  const [inputX, setInputX] = useState<string>(currentValX.toFixed(2));
  const [inputY, setInputY] = useState<string>(currentValY.toFixed(2));

  const isFocusedXRef = useRef(false);
  const isFocusedYRef = useRef(false);

  // Synchronize input fields when coordinates or unit change externally (e.g. canvas drag or unit toggle)
  useEffect(() => {
    if (!isFocusedXRef.current) {
      setInputX(currentValX.toFixed(2));
    }
  }, [currentValX]);

  useEffect(() => {
    if (!isFocusedYRef.current) {
      setInputY(currentValY.toFixed(2));
    }
  }, [currentValY]);

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setInputX(valStr);
    const parsedX = parseFloat(valStr);
    if (!isNaN(parsedX) && parsedX >= 0) {
      const newGuideX = parsedX * pixelsPerUnit;
      if (isRatioLocked && lockedRatio && lockedRatio > 0.0001) {
        const newParsedY = parsedX / lockedRatio;
        const newGuideY = newParsedY * pixelsPerUnit;
        setInputY(newParsedY.toFixed(2));
        onGuideChange(newGuideX, newGuideY);
      } else {
        onGuideChange(newGuideX, guideY);
      }
    }
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setInputY(valStr);
    const parsedY = parseFloat(valStr);
    if (!isNaN(parsedY) && parsedY >= 0) {
      const newGuideY = parsedY * pixelsPerUnit;
      if (isRatioLocked && lockedRatio && lockedRatio > 0.0001) {
        const newParsedX = parsedY * lockedRatio;
        const newGuideX = newParsedX * pixelsPerUnit;
        setInputX(newParsedX.toFixed(2));
        onGuideChange(newGuideX, newGuideY);
      } else {
        onGuideChange(guideX, newGuideY);
      }
    }
  };

  const handleXBlur = () => {
    isFocusedXRef.current = false;
    const parsedX = parseFloat(inputX);
    if (isNaN(parsedX) || parsedX < 0) {
      setInputX(currentValX.toFixed(2));
    } else {
      setInputX(parsedX.toFixed(2));
    }
  };

  const handleYBlur = () => {
    isFocusedYRef.current = false;
    const parsedY = parseFloat(inputY);
    if (isNaN(parsedY) || parsedY < 0) {
      setInputY(currentValY.toFixed(2));
    } else {
      setInputY(parsedY.toFixed(2));
    }
  };

  const unitLabel = unit === 'cm' ? 'cm' : 'in';

  return (
    <div
      id="guide-control-bar"
      className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl shadow-lg px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 sm:gap-2 text-slate-800 pointer-events-auto select-none max-w-[calc(100vw-72px)] overflow-x-auto"
    >
      {/* X axis length */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-slate-800 font-mono">X:</span>
        <input
          type="number"
          id="guide-x-input"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={inputX}
          disabled={isPositionLocked}
          onChange={handleXChange}
          onFocus={() => {
            isFocusedXRef.current = true;
          }}
          onBlur={handleXBlur}
          className={`w-13 sm:w-14 text-center font-bold font-mono text-xs sm:text-sm bg-slate-50 border rounded-lg py-0.5 px-1 outline-none transition-colors ${
            isPositionLocked
              ? 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
              : 'border-slate-300 text-slate-900 focus:border-red-500 focus:bg-white'
          }`}
          title="手動輸入 X 軸長度"
          aria-label="X 軸長度"
        />
        <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{unitLabel}</span>
      </div>

      {/* Ratio lock / chain button */}
      <button
        type="button"
        id="btn-guide-ratio"
        onClick={onToggleRatioLock}
        disabled={isPositionLocked}
        className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
          isRatioLocked
            ? 'bg-red-50 border-red-300 text-red-600 shadow-xs'
            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
        } ${isPositionLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isRatioLocked ? '長寬比例已鎖定 (點擊解鎖)' : '鎖定 X/Y 長寬比例'}
        aria-label={isRatioLocked ? '長寬比例已鎖定' : '未鎖定比例'}
      >
        {isRatioLocked ? (
          <Link2 className="w-3.5 h-3.5 stroke-[2.5]" />
        ) : (
          <Link2Off className="w-3.5 h-3.5 stroke-[2.2]" />
        )}
      </button>

      {/* Y axis length */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-slate-800 font-mono">Y:</span>
        <input
          type="number"
          id="guide-y-input"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={inputY}
          disabled={isPositionLocked}
          onChange={handleYChange}
          onFocus={() => {
            isFocusedYRef.current = true;
          }}
          onBlur={handleYBlur}
          className={`w-13 sm:w-14 text-center font-bold font-mono text-xs sm:text-sm bg-slate-50 border rounded-lg py-0.5 px-1 outline-none transition-colors ${
            isPositionLocked
              ? 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
              : 'border-slate-300 text-slate-900 focus:border-red-500 focus:bg-white'
          }`}
          title="手動輸入 Y 軸長度"
          aria-label="Y 軸長度"
        />
        <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{unitLabel}</span>
      </div>

      {/* Position lock button */}
      <button
        type="button"
        id="btn-guide-lock"
        onClick={onTogglePositionLock}
        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
          isPositionLocked
            ? 'bg-red-500 hover:bg-red-600 border-red-600 text-white shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
        }`}
        title={isPositionLocked ? '參考線位置已鎖定 (點擊解鎖)' : '鎖定參考線位置'}
        aria-label={isPositionLocked ? '解除位置鎖定' : '鎖定位置'}
      >
        {isPositionLocked ? (
          <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
        ) : (
          <Unlock className="w-3.5 h-3.5 stroke-[2.2]" />
        )}
      </button>
    </div>
  );
};
