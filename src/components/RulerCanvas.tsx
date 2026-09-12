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
}

export const RulerCanvas: React.FC<RulerCanvasProps> = ({
  ppi,
  unit,
  colorScheme,
  showGuides,
  guideX,
  guideY,
  onGuideChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const draggingRef = useRef<'x' | 'y' | 'both' | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Measure and render
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = colorScheme.canvasBg;
    ctx.fillRect(0, 0, width, height);

    // Origin coordinates: left-bottom margin
    const originX = 40;
    const originY = height - 40;

    // Scale calculation
    const pixelsPerUnit = unit === 'cm' ? ppi / 2.54 : ppi;
    const subDivisions = unit === 'cm' ? 10 : 8; // 1mm for cm, 1/8" for inch
    const pixelsPerSub = pixelsPerUnit / subDivisions;

    // 1. Draw minor grid lines
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = colorScheme.minorLineColor;
    ctx.beginPath();
    // Vertical minor
    for (let x = originX + pixelsPerSub; x < width; x += pixelsPerSub) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    // Horizontal minor
    for (let y = originY - pixelsPerSub; y > 0; y -= pixelsPerSub) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 2. Draw major grid lines (per 1 unit)
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = colorScheme.majorLineColor;
    ctx.beginPath();
    // Vertical major
    for (let x = originX + pixelsPerUnit; x < width; x += pixelsPerUnit) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    // Horizontal major
    for (let y = originY - pixelsPerUnit; y > 0; y -= pixelsPerUnit) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 3. Main Axes (X & Y lines)
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = colorScheme.axisLineColor;
    ctx.beginPath();
    // X Axis
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    // Y Axis
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // 4. Tick marks and numbering
    ctx.fillStyle = colorScheme.textColor;
    ctx.font = '500 11px system-ui, -apple-system, sans-serif';

    // --- X Axis Ticks & Labels ---
    ctx.textAlign = 'center';
    let countX = 0;
    for (let x = originX; x < width; x += pixelsPerUnit) {
      // Major tick mark
      ctx.strokeStyle = colorScheme.axisLineColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, originY);
      ctx.lineTo(x, originY + 8);
      ctx.stroke();

      // Number
      if (countX > 0) {
        ctx.fillText(String(countX), x, originY + 22);
      }

      // Halfway tick (0.5 cm or 0.5 inch)
      const halfX = x + pixelsPerUnit / 2;
      if (halfX < width) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(halfX, originY);
        ctx.lineTo(halfX, originY + 5);
        ctx.stroke();
      }

      countX++;
    }

    // --- Y Axis Ticks & Labels ---
    ctx.textAlign = 'right';
    let countY = 0;
    for (let y = originY; y > 0; y -= pixelsPerUnit) {
      // Major tick mark
      ctx.strokeStyle = colorScheme.axisLineColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(originX - 8, y);
      ctx.stroke();

      // Number
      if (countY > 0) {
        ctx.fillText(String(countY), originX - 12, y + 4);
      }

      // Halfway tick
      const halfY = y - pixelsPerUnit / 2;
      if (halfY > 0) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(originX, halfY);
        ctx.lineTo(originX - 5, halfY);
        ctx.stroke();
      }

      countY++;
    }

    // Unit label at origin corner
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = colorScheme.textColor;
    ctx.fillText(unit.toUpperCase(), originX - 18, originY + 20);

    // 5. Red Photoshop-style Reference Lines (when active)
    if (showGuides) {
      const lineX = originX + guideX;
      const lineY = originY - guideY;

      ctx.save();
      // Line styling - solid red reference line per user request
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = colorScheme.guideLineColor;
      ctx.setLineDash([]);

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

      // Solid cross center handle
      ctx.setLineDash([]);
      ctx.fillStyle = colorScheme.guideLineColor;

      // Outer glow/ring if dragging
      if (isDragging) {
        ctx.beginPath();
        ctx.arc(lineX, lineY, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fill();
      }

      // Intersection handle dot
      ctx.beginPath();
      ctx.arc(lineX, lineY, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = colorScheme.guideLineColor;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Live measurement values
      const valX = (guideX / pixelsPerUnit).toFixed(2);
      const valY = (guideY / pixelsPerUnit).toFixed(2);
      const labelText = `X: ${valX} ${unit}   Y: ${valY} ${unit}`;

      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      const textMetrics = ctx.measureText(labelText);
      const badgeWidth = textMetrics.width + 16;
      const badgeHeight = 26;

      // Position badge safely inside canvas
      let badgeX = lineX + 12;
      let badgeY = lineY - 34;

      if (badgeX + badgeWidth > width - 10) {
        badgeX = lineX - badgeWidth - 12;
      }
      if (badgeY < 12) {
        badgeY = lineY + 12;
      }

      // Badge background pill
      ctx.fillStyle = 'rgba(239, 68, 68, 0.94)';
      ctx.beginPath();
      // Support roundRect
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 6);
      } else {
        ctx.rect(badgeX, badgeY, badgeWidth, badgeHeight);
      }
      ctx.fill();

      // Subtle shadow/border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Badge text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(labelText, badgeX + 8, badgeY + 17);

      ctx.restore();
    }

    ctx.restore();
  }, [ppi, unit, colorScheme, showGuides, guideX, guideY, isDragging]);

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

  // Pointer/Touch handling for draggable reference lines
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

  const handleDragStart = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    if (!showGuides) return;
    const pos = getCanvasPos(e);
    const originX = 40;
    const originY = window.innerHeight - 40;

    const currentX = originX + guideX;
    const currentY = originY - guideY;

    const hitThreshold = 38; // forgiving hit region for mobile touches
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
    }
  };

  const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!draggingRef.current || !showGuides) return;
    if (e.cancelable) {
      e.preventDefault();
    }

    const pos = getCanvasPos(e);
    const originX = 40;
    const originY = window.innerHeight - 40;

    let newX = guideX;
    let newY = guideY;

    if (draggingRef.current === 'x' || draggingRef.current === 'both') {
      newX = Math.max(0, pos.x - originX);
    }
    if (draggingRef.current === 'y' || draggingRef.current === 'both') {
      newY = Math.max(0, originY - pos.y);
    }

    onGuideChange(newX, newY);
  }, [guideX, guideY, onGuideChange, showGuides]);

  const handleDragEnd = useCallback(() => {
    if (draggingRef.current) {
      draggingRef.current = null;
      setIsDragging(false);
    }
  }, []);

  useEffect(() => {
    const onMove = (e: TouchEvent | MouseEvent) => handleDragMove(e);
    const onUp = () => handleDragEnd();

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
  }, [handleDragMove, handleDragEnd]);

  return (
    <canvas
      ref={canvasRef}
      id="ruler-canvas"
      className="absolute inset-0 block w-full h-full touch-none select-none cursor-crosshair"
      onTouchStart={handleDragStart}
      onMouseDown={handleDragStart}
    />
  );
};
