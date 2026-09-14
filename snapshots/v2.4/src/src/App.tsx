import React, { useState, useEffect, useCallback } from 'react';
import { Unit, BG_COLOR_OPTIONS, GuideMode } from './types';
import { RulerCanvas } from './components/RulerCanvas';
import { RightToolbar } from './components/RightToolbar';
import { ManualTuningBar } from './components/ManualTuningBar';
import { ReferenceLineBar } from './components/ReferenceLineBar';
import { CardCalibrationModal } from './components/CardCalibrationModal';
import { InfoModal } from './components/InfoModal';
import { DonateModal } from './components/DonateModal';

function estimateInitialPpi(): number {
  if (typeof window === 'undefined') return 160;
  const ua = navigator.userAgent;
  const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIPad) return 132;
  const isIPhone = /iPhone|iPod/i.test(ua);
  if (isIPhone) return 163; // Standard 163 CSS points per inch on iOS
  const isAndroid = /Android/i.test(ua);
  if (isAndroid) return 160;
  return 96;
}

export default function App() {
  const defaultPpi = estimateInitialPpi();

  // Persisted or fallback settings
  const [ppi, setPpi] = useState<number>(() => {
    const saved = localStorage.getItem('calibrated_ppi');
    return saved ? parseFloat(saved) || defaultPpi : defaultPpi;
  });

  const [unit, setUnit] = useState<Unit>(() => {
    const saved = localStorage.getItem('ruler_unit');
    return saved === 'in' ? 'in' : 'cm';
  });

  const [bgIndex, setBgIndex] = useState<number>(() => {
    const saved = localStorage.getItem('ruler_bg_index');
    return saved !== null ? parseInt(saved, 10) % BG_COLOR_OPTIONS.length : 0;
  });

  // Reference lines: 3-mode ('off' -> 'all' [box+lines] -> 'lines' [lines only] -> 'off')
  const [guideMode, setGuideMode] = useState<GuideMode>('off');
  const [guideX, setGuideX] = useState<number>(140);
  const [guideY, setGuideY] = useState<number>(140);
  const [isPositionLocked, setIsPositionLocked] = useState<boolean>(false);
  const [isRatioLocked, setIsRatioLocked] = useState<boolean>(false);
  const [lockedRatio, setLockedRatio] = useState<number | null>(null);

  // Modals & Panels
  const [isManualTuningOpen, setIsManualTuningOpen] = useState<boolean>(false);
  const [isCardSyncOpen, setIsCardSyncOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Sync to localStorage
  const handlePpiChange = useCallback((newPpi: number) => {
    setPpi(newPpi);
    localStorage.setItem('calibrated_ppi', String(newPpi));
  }, []);

  const handleUnitToggle = useCallback(() => {
    setUnit((prev) => {
      const next: Unit = prev === 'cm' ? 'in' : 'cm';
      localStorage.setItem('ruler_unit', next);
      return next;
    });
  }, []);

  const handleCycleBgColor = useCallback(() => {
    setBgIndex((prev) => {
      const next = (prev + 1) % BG_COLOR_OPTIONS.length;
      localStorage.setItem('ruler_bg_index', String(next));
      return next;
    });
  }, []);

  const handleToggleGuides = useCallback(() => {
    setGuideMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'lines';
      return 'off';
    });
  }, []);

  const handleToggleRatioLock = useCallback(() => {
    setIsRatioLocked((prev) => {
      const next = !prev;
      if (next) {
        const pixelsPerUnit = unit === 'cm' ? ppi / 2.54 : ppi;
        const valX = guideX / pixelsPerUnit;
        const valY = guideY / pixelsPerUnit;
        const ratio = valY > 0.0001 ? valX / valY : 1.0;
        setLockedRatio(ratio);
      } else {
        setLockedRatio(null);
      }
      return next;
    });
  }, [unit, ppi, guideX, guideY]);

  const handleTogglePositionLock = useCallback(() => {
    setIsPositionLocked((prev) => !prev);
  }, []);

  const handleToggleManualTuning = useCallback(() => {
    setIsManualTuningOpen((prev) => !prev);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const currentColor = BG_COLOR_OPTIONS[bgIndex] || BG_COLOR_OPTIONS[0];

  const showGuides = guideMode !== 'off';
  const showGuideControlBar = guideMode === 'all';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = currentColor.bgColor;
      document.documentElement.style.backgroundColor = currentColor.bgColor;
    }
  }, [currentColor]);

  return (
    <div
      className="relative w-full min-h-screen h-full overflow-hidden select-none touch-none"
      style={{ backgroundColor: currentColor.bgColor }}
    >
      {/* Background Interactive Ruler Canvas */}
      <RulerCanvas
        ppi={ppi}
        unit={unit}
        colorScheme={currentColor}
        showGuides={showGuides}
        guideX={guideX}
        guideY={guideY}
        onGuideChange={(x, y) => {
          setGuideX(x);
          setGuideY(y);
        }}
        isPositionLocked={isPositionLocked}
        isRatioLocked={isRatioLocked}
        lockedRatio={lockedRatio}
      />

      {/* Top Left Floating Bars Container: PPI Manual Tuning & Reference Line Control */}
      <div
        className="fixed z-40 flex flex-col items-start gap-2 pointer-events-none max-w-[calc(100vw-72px)] landscape:max-w-[calc(100vw-340px)] max-h-[520px]:max-w-[calc(100vw-340px)]"
        style={{
          left: 'calc(14px + env(safe-area-inset-left, 0px))',
          top: 'calc(10px + env(safe-area-inset-top, 0px))',
        }}
      >
        {isManualTuningOpen && (
          <ManualTuningBar
            ppi={ppi}
            onPpiChange={handlePpiChange}
            onClose={() => setIsManualTuningOpen(false)}
            defaultPpi={defaultPpi}
          />
        )}

        {showGuideControlBar && (
          <ReferenceLineBar
            unit={unit}
            ppi={ppi}
            guideX={guideX}
            guideY={guideY}
            onGuideChange={(x, y) => {
              setGuideX(x);
              setGuideY(y);
            }}
            isPositionLocked={isPositionLocked}
            onTogglePositionLock={handleTogglePositionLock}
            isRatioLocked={isRatioLocked}
            onToggleRatioLock={handleToggleRatioLock}
            lockedRatio={lockedRatio}
          />
        )}
      </div>

      {/* Right Toolbar: Vertical circle button column (1-6) and collapse toggle (7) */}
      <RightToolbar
        unit={unit}
        onToggleUnit={handleUnitToggle}
        guideMode={guideMode}
        onToggleGuides={handleToggleGuides}
        onCycleBgColor={handleCycleBgColor}
        onOpenCardSync={() => setIsCardSyncOpen(true)}
        isManualTuningOpen={isManualTuningOpen}
        onToggleManualTuning={handleToggleManualTuning}
        onOpenInfo={() => setIsInfoOpen(true)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Card Calibration Modal */}
      {isCardSyncOpen && (
        <CardCalibrationModal
          ppi={ppi}
          onPpiChange={handlePpiChange}
          onSaveAndClose={() => {
            handlePpiChange(ppi);
            setIsCardSyncOpen(false);
          }}
          onClose={() => setIsCardSyncOpen(false)}
          defaultPpi={defaultPpi}
        />
      )}

      {/* Information & Author Modal */}
      {isInfoOpen && (
        <InfoModal
          onClose={() => setIsInfoOpen(false)}
          onOpenDonate={() => {
            setIsInfoOpen(false);
            setIsDonateOpen(true);
          }}
        />
      )}

      {/* Donation & Support Modal */}
      {isDonateOpen && (
        <DonateModal
          onClose={() => setIsDonateOpen(false)}
          onBackToInfo={() => {
            setIsDonateOpen(false);
            setIsInfoOpen(true);
          }}
        />
      )}
    </div>
  );
}
