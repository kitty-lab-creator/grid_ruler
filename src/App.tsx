import React, { useState, useEffect, useCallback } from 'react';
import { Unit, BG_COLOR_OPTIONS } from './types';
import { RulerCanvas } from './components/RulerCanvas';
import { RightToolbar } from './components/RightToolbar';
import { ManualTuningBar } from './components/ManualTuningBar';
import { CardCalibrationModal } from './components/CardCalibrationModal';
import { InfoModal } from './components/InfoModal';

function estimateInitialPpi(): number {
  if (typeof window === 'undefined') return 160;
  const ua = navigator.userAgent;
  const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIPad) return 132;
  const isIPhone = /iPhone|iPod/i.test(ua);
  if (isIPhone) return 163;
  const isAndroid = /Android/i.test(ua);
  if (isAndroid) return 160;
  return 96;
}

export default function App() {
  const defaultPpi = estimateInitialPpi();

  // Load persisted settings or sensible defaults
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

  // Reference lines: MUST be OFF by default per user requirement
  const [showGuides, setShowGuides] = useState<boolean>(false);
  const [guideX, setGuideX] = useState<number>(140);
  const [guideY, setGuideY] = useState<number>(140);

  // Modals & UI controls
  const [isManualTuningOpen, setIsManualTuningOpen] = useState<boolean>(false);
  const [isCardSyncOpen, setIsCardSyncOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Direct entry without automatic card sync modal popup

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

  // Background color cycle: white -> yellow -> grey -> black -> white
  const handleCycleBgColor = useCallback(() => {
    setBgIndex((prev) => {
      const next = (prev + 1) % BG_COLOR_OPTIONS.length;
      localStorage.setItem('ruler_bg_index', String(next));
      return next;
    });
  }, []);

  const handleToggleGuides = useCallback(() => {
    setShowGuides((prev) => !prev);
  }, []);

  const handleToggleManualTuning = useCallback(() => {
    setIsManualTuningOpen((prev) => !prev);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const currentColor = BG_COLOR_OPTIONS[bgIndex] || BG_COLOR_OPTIONS[0];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = currentColor.bgColor;
      document.documentElement.style.backgroundColor = currentColor.bgColor;
    }
  }, [currentColor]);

  return (
    <div
      className="relative w-screen h-screen h-[100dvh] overflow-hidden select-none touch-none"
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
      />

      {/* Manual Tuning Bar (Top) */}
      {isManualTuningOpen && (
        <ManualTuningBar
          ppi={ppi}
          onPpiChange={handlePpiChange}
          onClose={() => setIsManualTuningOpen(false)}
          defaultPpi={defaultPpi}
        />
      )}

      {/* Right Toolbar: Vertical circle button column (1-6) and collapse toggle (7) */}
      <RightToolbar
        unit={unit}
        onToggleUnit={handleUnitToggle}
        showGuides={showGuides}
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
      {isInfoOpen && <InfoModal onClose={() => setIsInfoOpen(false)} />}
    </div>
  );
}
