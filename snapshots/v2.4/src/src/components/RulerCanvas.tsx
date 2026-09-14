import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Unit, BgColorOption } from '../types';

interface RulerCanvasProps {
  ppi: number;
  unit: Unit;
  colorScheme: BgColorOption;
  showGuides: boolean;
  guideX: number; // distance in px from originX
  guideY: number; // distance in px from originY
  onGuideChange: (newX: number, newY: number) => void;
  isPositionLocked?: boolean;
  isRatioLocked?: boolean;
  lockedRatio?: number | null;
}

export const RulerCanvas: React.FC<RulerCanvasProps> = ({
  ppi,
  unit,
  colorScheme,
  showGuides,
  guideX,
  guideY,
  onGuideChange,
  isPositionLocked = false,
  isRatioLocked = false,
  lockedRatio = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const draggingRef = useRef<'x' | 'y' | 'both' | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Origin offset constants
  const originX = 36;
  const getOriginY = (height: number) => height - 36;

  // Measure and render
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Background fill
    ctx.fillStyle = colorScheme.canvasBg;
    ctx.fillRect(0, 0, width, height);

    const originY = getOriginY(height);

    // Scale calculation
    const pixelsPerUnit = unit === 'cm' ? ppi / 2.54 : ppi;
    const subDivisions = unit === 'cm' ? 10 : 8; // 1mm for cm (10 subs/cm), 1/8" for inch (8 subs/in)
    const pixelsPerSub = pixelsPerUnit / subDivisions;

    // 1. Minor Grid Lines (Confined to grid quadrant)
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = colorScheme.minorLineColor;
    ctx.beginPath();
    // Vertical minor lines
    for (let x = originX + pixelsPerSub; x < width; x += pixelsPerSub) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, originY);
    }
    // Horizontal minor lines
    for (let y = originY - pixelsPerSub; y > 0; y -= pixelsPerSub) {
      ctx.moveTo(originX, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 2. Major Grid Lines (Per 1 cm or 1 inch)
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = colorScheme.majorLineColor;
    ctx.beginPath();
    // Vertical major lines
    for (let x = originX + pixelsPerUnit; x < width; x += pixelsPerUnit) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, originY);
    }
    // Horizontal major lines
    for (let y = originY - pixelsPerUnit; y > 0; y -= pixelsPerUnit) {
      ctx.moveTo(originX, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 3. Main Axes (Solid high-contrast axis lines)
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = colorScheme.axisLineColor;
    ctx.beginPath();
    // X Axis line
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    // Y Axis line
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // 4. Tick Marks and Numbering
    ctx.fillStyle = colorScheme.textColor;
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // --- Horizontal (X) Axis Ticks & Labels ---
    ctx.textAlign = 'center';
    let countX = 0;
    for (let x = originX; x < width; x += pixelsPerUnit) {
      // Major tick mark
      ctx.strokeStyle = colorScheme.axisLineColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x, originY);
      ctx.lineTo(x, originY + 7);
      ctx.stroke();

      // Number label below tick
      if (countX > 0) {
        ctx.fillText(String(countX), x, originY + 21);
      }

      // Halfway tick (0.5 unit)
      const halfX = x + pixelsPerUnit / 2;
      if (halfX < width) {
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(halfX, originY);
        ctx.lineTo(halfX, originY + 4.5);
        ctx.stroke();
      }

      // Quarter ticks for inches
      if (unit === 'in') {
        const q1 = x + pixelsPerUnit * 0.25;
        const q3 = x + pixelsPerUnit * 0.75;
        ctx.lineWidth = 0.8;
        if (q1 < width) {
          ctx.beginPath();
          ctx.moveTo(q1, originY);
          ctx.lineTo(q1, originY + 3);
          ctx.stroke();
        }
        if (q3 < width) {
          ctx.beginPath();
          ctx.moveTo(q3, originY);
          ctx.lineTo(q3, originY + 3);
          ctx.stroke();
        }
      }

      countX++;
    }

    // --- Vertical (Y) Axis Ticks & Labels ---
    ctx.textAlign = 'right';
    let countY = 0;
    for (let y = originY; y > 0; y -= pixelsPerUnit) {
      // Major tick mark
      ctx.strokeStyle = colorScheme.axisLineColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(originX - 7, y);
      ctx.stroke();

      // Number label to the left of tick
      if (countY > 0) {
        ctx.fillText(String(countY), originX - 10, y + 4.5);
      }

      // Halfway tick
      const halfY = y - pixelsPerUnit / 2;
      if (halfY > 0) {
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(originX, halfY);
        ctx.lineTo(originX - 4.5, halfY);
        ctx.stroke();
      }

      // Quarter ticks for inches
      if (unit === 'in') {
        const q1 = y - pixelsPerUnit * 0.25;
        const q3 = y - pixelsPerUnit * 0.75;
        ctx.lineWidth = 0.8;
        if (q1 > 0) {
          ctx.beginPath();
          ctx.moveTo(originX, q1);
          ctx.lineTo(originX - 3, q1);
          ctx.stroke();
        }
        if (q3 > 0) {
          ctx.beginPath();
          ctx.moveTo(originX, q3);
          ctx.lineTo(originX - 3, q3);
          ctx.stroke();
        }
      }

      countY++;
    }

    // Unit label in origin corner box
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = colorScheme.textColor;
    ctx.fillText(unit.toUpperCase(), originX / 2, originY + 21);

    // 5. Solid Red Reference Lines & Interactive Crosshairs
    if (showGuides) {
      const lineX = originX + guideX;
      const lineY = originY - guideY;

      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = colorScheme.guideLineColor;
      ctx.setLineDash([]); // Solid continuous line

      // Vertical guide line
      ctx.beginPath();
      ctx.moveTo(lineX, 0);
      ctx.lineTo(lineX, height);
      ctx.stroke();

      // Horizontal guide line
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(width, lineY);
      ctx.stroke();

      // Outer halo when dragging
      if (isDragging) {
        ctx.beginPath();
        ctx.arc(lineX, lineY, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.25)';
        ctx.fill();
      }

      // Intersection center dot
      ctx.beginPath();
      ctx.arc(lineX, lineY, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = colorScheme.guideLineColor;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Live measurement values
      const valX = (guideX / pixelsPerUnit).toFixed(1);
      const valY = (guideY / pixelsPerUnit).toFixed(1);
      const lockSuffix = isPositionLocked ? ' 🔒' : isRatioLocked ? ' 🔗' : '';
      const labelText = `X: ${valX} ${unit}  Y: ${valY} ${unit}${lockSuffix}`;

      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const textMetrics = ctx.measureText(labelText);
      const badgeWidth = textMetrics.width + 16;
      const badgeHeight = 26;

      // Position badge safely relative to crosshair
      let badgeX = lineX + 12;
      let badgeY = lineY - 34;

      if (badgeX + badgeWidth > width - 12) {
        badgeX = lineX - badgeWidth - 12;
      }
      if (badgeY < 12) {
        badgeY = lineY + 12;
      }

      // Badge pill background
      ctx.fillStyle = 'rgba(220, 38, 38, 0.95)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 6);
      } else {
        ctx.rect(badgeX, badgeY, badgeWidth, badgeHeight);
      }
      ctx.fill();

      // Subtle border for high visibility
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Badge text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(labelText, badgeX + 8, badgeY + 17);

      ctx.restore();
    }

    ctx.restore();
  }, [ppi, unit, colorScheme, showGuides, guideX, guideY, isDragging, isPositionLocked, isRatioLocked]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = () => {
      draw();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Pointer / Touch Handling
  const getCanvasPos = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    if (!showGuides || isPositionLocked) return;
    const pos = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const originY = getOriginY(rect.height);

    const currentX = originX + guideX;
    const currentY = originY - guideY;

    const hitThreshold = 38;
    const nearX = Math.abs(pos.x - currentX) < hitThreshold;
    const nearY = Math.abs(pos.y - currentY) < hitThreshold;

    if (nearX && nearY) {
      draggingRef.current = 'both';
      setIsDragging(true);
    } else if (nearX) {
      draggingRef.current = 'x';
      setIsDragging(true);
    } else if (nearY) {
      draggingRef.current = 'y';
      setIsDragging(true);
    } else {
      // Direct touch on grid: immediately jump crosshair to touch position
      const newX = Math.max(0, pos.x - originX);
      const newY = isRatioLocked && lockedRatio && lockedRatio > 0.0001
        ? newX / lockedRatio
        : Math.max(0, originY - pos.y);
      onGuideChange(newX, newY);
      draggingRef.current = 'both';
      setIsDragging(true);
    }
  };

  const handlePointerMove = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!draggingRef.current || !showGuides || isPositionLocked) return;
      if (e.cancelable) {
        e.preventDefault();
      }

      const pos = getCanvasPos(e);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const originY = getOriginY(rect.height);

      let newX = guideX;
      let newY = guideY;

      if (isRatioLocked && lockedRatio && lockedRatio > 0.0001) {
        if (draggingRef.current === 'both' || draggingRef.current === 'x') {
          newX = Math.max(0, pos.x - originX);
          newY = newX / lockedRatio;
        } else if (draggingRef.current === 'y') {
          newY = Math.max(0, originY - pos.y);
          newX = newY * lockedRatio;
        }
      } else {
        if (draggingRef.current === 'x' || draggingRef.current === 'both') {
          newX = Math.max(0, pos.x - originX);
        }
        if (draggingRef.current === 'y' || draggingRef.current === 'both') {
          newY = Math.max(0, originY - pos.y);
        }
      }

      onGuideChange(newX, newY);
    },
    [guideX, guideY, onGuideChange, showGuides, isPositionLocked, isRatioLocked, lockedRatio]
  );

  const handlePointerUp = useCallback(() => {
    if (draggingRef.current) {
      draggingRef.current = null;
      setIsDragging(false);
    }
  }, []);

  useEffect(() => {
    const onMove = (e: TouchEvent | MouseEvent) => handlePointerMove(e);
    const onUp = () => handlePointerUp();

    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <canvas
      ref={canvasRef}
      id="ruler-canvas"
      className={`absolute inset-0 block w-full h-full touch-none select-none ${
        isPositionLocked ? 'cursor-default' : 'cursor-crosshair'
      }`}
      onTouchStart={handlePointerDown}
      onMouseDown={handlePointerDown}
    />
  );
};
