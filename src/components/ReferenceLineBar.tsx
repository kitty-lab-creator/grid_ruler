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

  const [inputX, setInputX] = useState<string>(currentValX.toFixed(1));
  const [inputY, setInputY] = useState<string>(currentValY.toFixed(1));

  const isFocusedXRef = useRef(false);
  const isFocusedYRef = useRef(false);

  // Synchronize input fields when coordinates or unit change externally (e.g. canvas drag or unit toggle)
  useEffect(() => {
    if (!isFocusedXRef.current) {
      setInputX(currentValX.toFixed(1));
    }
  }, [currentValX]);

  useEffect(() => {
    if (!isFocusedYRef.current) {
      setInputY(currentValY.toFixed(1));
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
        setInputY(newParsedY.toFixed(1));
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
        setInputX(newParsedX.toFixed(1));
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
      setInputX(currentValX.toFixed(1));
    } else {
      setInputX(parsedX.toFixed(1));
    }
  };

  const handleYBlur = () => {
    isFocusedYRef.current = false;
    const parsedY = parseFloat(inputY);
    if (isNaN(parsedY) || parsedY < 0) {
      setInputY(currentValY.toFixed(1));
    } else {
      setInputY(parsedY.toFixed(1));
    }
  };

  const unitLabel = unit === 'cm' ? 'cm' : 'in';

  return (
    <div
      id="guide-control-bar"
      className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl shadow-lg px-2 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-1.5 text-slate-800 pointer-events-auto select-none max-w-full"
    >
      {/* X axis length */}
      <div className="flex items-center gap-0.5">
        <span className="text-[11px] sm:text-xs font-bold text-slate-800 font-mono">X:</span>
        <input
          type="number"
          id="guide-x-input"
          inputMode="decimal"
          step="0.1"
          min="0"
          value={inputX}
          disabled={isPositionLocked}
          onChange={handleXChange}
          onFocus={(e) => {
            isFocusedXRef.current = true;
            setInputX('');
          }}
          onClick={() => {
            if (!isPositionLocked && inputX !== '') {
              setInputX('');
            }
          }}
          onBlur={handleXBlur}
          className={`w-[38px] sm:w-[42px] text-center font-bold font-mono text-xs bg-slate-50 border rounded-md py-0.5 px-0.5 outline-none transition-colors ${
            isPositionLocked
              ? 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
              : 'border-slate-300 text-slate-900 focus:border-red-500 focus:bg-white'
          }`}
          title="手動輸入 X 軸長度"
          aria-label="X 軸長度"
        />
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mr-0.5">{unitLabel}</span>
      </div>

      {/* Ratio lock / chain button */}
      <button
        type="button"
        id="btn-guide-ratio"
        onClick={onToggleRatioLock}
        disabled={isPositionLocked}
        className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
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
      <div className="flex items-center gap-0.5">
        <span className="text-[11px] sm:text-xs font-bold text-slate-800 font-mono">Y:</span>
        <input
          type="number"
          id="guide-y-input"
          inputMode="decimal"
          step="0.1"
          min="0"
          value={inputY}
          disabled={isPositionLocked}
          onChange={handleYChange}
          onFocus={(e) => {
            isFocusedYRef.current = true;
            setInputY('');
          }}
          onClick={() => {
            if (!isPositionLocked && inputY !== '') {
              setInputY('');
            }
          }}
          onBlur={handleYBlur}
          className={`w-[38px] sm:w-[42px] text-center font-bold font-mono text-xs bg-slate-50 border rounded-md py-0.5 px-0.5 outline-none transition-colors ${
            isPositionLocked
              ? 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
              : 'border-slate-300 text-slate-900 focus:border-red-500 focus:bg-white'
          }`}
          title="手動輸入 Y 軸長度"
          aria-label="Y 軸長度"
        />
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mr-0.5">{unitLabel}</span>
      </div>

      {/* Position lock button */}
      <button
        type="button"
        id="btn-guide-lock"
        onClick={onTogglePositionLock}
        className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
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
