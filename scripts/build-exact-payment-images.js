import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

const DIRS = [
  path.resolve('public/assets/donate'),
  path.resolve('dist/assets/donate'),
  path.resolve('assets/donate'),
  path.resolve('snapshots/v2.3/public/assets/donate'),
];

DIRS.forEach(d => fs.mkdirSync(d, { recursive: true }));

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawFinder(ctx, x, y, size, dotColor = '#000000', bgColor = '#ffffff', isRound = false) {
  const s = size;
  const unit = s / 7;
  
  if (isRound) {
    ctx.fillStyle = dotColor;
    roundRect(ctx, x, y, s, s, unit * 2);
    ctx.fill();

    ctx.fillStyle = bgColor;
    roundRect(ctx, x + unit, y + unit, s - unit * 2, s - unit * 2, unit * 1.5);
    ctx.fill();

    ctx.fillStyle = dotColor;
    roundRect(ctx, x + unit * 2, y + unit * 2, s - unit * 4, s - unit * 4, unit);
    ctx.fill();
  } else {
    ctx.fillStyle = dotColor;
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = bgColor;
    ctx.fillRect(x + unit, y + unit, s - unit * 2, s - unit * 2);

    ctx.fillStyle = dotColor;
    ctx.fillRect(x + unit * 2, y + unit * 2, s - unit * 4, s - unit * 4);
  }
}

// 1. PayPal
function generatePayPal() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const margin = 30;
  const gridW = size - margin * 2;
  const modules = 37;
  const modSize = gridW / modules;

  const grid = [
    "111111101010110100111011001101001111111",
    "100000100001000110000100001010001000001",
    "101110100011000111111110110101001011101",
    "101110101100101010001000001010001011101",
    "101110100101011111010001110011101011101",
    "100000101110100001101100011001001000001",
    "111111101010101010101010101010101111111",
    "000000000000000000000000000000000000000",
    "101111101110010011100000111010001001100",
    "011001000010111000100001010101110001011",
    "010111101000010000000001010010111000110",
    "010000001101110000000001110000101001100",
    "101110101010010000000000101101111010011",
    "000010110001100000000000001001100101000",
    "110100000100100000000000010011001010111",
    "001001111100100000000000011010101001100",
    "110011001111110000000000000110011001101",
    "101001110010000000000000000101010101100",
    "010110101001110000000000001110110010110",
    "101101111011000000000000001011011101010",
    "001001010110100000000000011110001010101",
    "110110110011010000000000010110101001110",
    "010001001101000000000000000101101011011",
    "101101110100110000000000001000110001010",
    "011010101110101000101101001100101101101",
    "100100111001011101010010110011100100110",
    "001101001011001010101101011001010110101",
    "110011110100110101010011001101111001011",
    "000000001110011010111100111110101010100",
    "111111101011001010101101011011000111010",
    "100000100110110101010011001101011000101",
    "101110101101001010101101011011101101011",
    "101110100010110101010011001101010010100",
    "101110101101001010101101011011110111010",
    "100000100011101101010011001101001001101",
    "111111101100010010101101011011111100011"
  ];

  ctx.fillStyle = '#000000';
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
        continue;
      }
      if (r >= 12 && r <= 24 && c >= 12 && c <= 24) {
        continue;
      }
      if (grid[r] && grid[r][c] === '1') {
        ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize + 0.4, modSize + 0.4);
      }
    }
  }

  // Finders
  drawFinder(ctx, margin, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin + (modules - 7) * modSize, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin, margin + (modules - 7) * modSize, 7 * modSize, '#000000', '#ffffff', false);

  // Alignment Pattern
  drawFinder(ctx, margin + 28 * modSize, margin + 28 * modSize, 5 * modSize, '#000000', '#ffffff', false);

  // Center PayPal Logo Card
  const logoBoxSize = 13 * modSize;
  const lx = margin + 12 * modSize;
  const ly = margin + 12 * modSize;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, lx, ly, logoBoxSize, logoBoxSize, 12);
  ctx.fill();

  // Official PayPal Double-P Graphic
  ctx.save();
  ctx.translate(size / 2 - 25, size / 2 - 38);
  ctx.scale(1.05, 1.05);

  // Dark Blue P
  ctx.fillStyle = '#003087';
  ctx.beginPath();
  ctx.moveTo(14, 64);
  ctx.lineTo(28, 8);
  ctx.lineTo(48, 8);
  ctx.bezierCurveTo(62, 8, 70, 15, 68, 26);
  ctx.bezierCurveTo(66, 38, 56, 44, 42, 44);
  ctx.lineTo(32, 44);
  ctx.lineTo(27, 64);
  ctx.closePath();
  ctx.fill();

  // Light Blue P Overlay
  ctx.fillStyle = '#0079C1';
  ctx.beginPath();
  ctx.moveTo(28, 75);
  ctx.lineTo(42, 19);
  ctx.lineTo(62, 19);
  ctx.bezierCurveTo(76, 19, 84, 26, 82, 37);
  ctx.bezierCurveTo(80, 49, 70, 55, 56, 55);
  ctx.lineTo(46, 55);
  ctx.lineTo(41, 75);
  ctx.closePath();
  ctx.fill();

  // Overlay blend
  ctx.fillStyle = '#00457C';
  ctx.beginPath();
  ctx.moveTo(42, 19);
  ctx.lineTo(48, 19);
  ctx.bezierCurveTo(62, 19, 70, 26, 68, 37);
  ctx.bezierCurveTo(66, 44, 60, 49, 53, 51);
  ctx.lineTo(46, 55);
  ctx.lineTo(41, 75);
  ctx.lineTo(32, 44);
  ctx.lineTo(42, 19);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

// 2. PayMe
function generatePayMe() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const margin = 30;
  const gridW = size - margin * 2;
  const modules = 37;
  const modSize = gridW / modules;
  const dotRadius = modSize * 0.44;
  const paymeRed = '#e60012';

  const grid = [
    "1111111010111101010101011110101111111",
    "1000001011010010011001001011001000001",
    "1011101001101101101101101101101011101",
    "1011101011010010110110100101101011101",
    "1011101001101101001001011011001011101",
    "1000001011010010101010100101101000001",
    "1111111010101010101010101010101111111",
    "0000000000000000000000000000000000000",
    "1110100100011110001100001111001000100",
    "1001101101101000010011111101111101011",
    "0110010010101101110010110010011101010",
    "1011001110100011011010100011110011111",
    "1110100111010101101011101011011101100",
    "0010010000000000000000000000010010010",
    "1000101101000000000000000000010110110",
    "1101111100100000000000000000011010111",
    "0100101011100000000000000000001110001",
    "1011111101000000000000000000000100101",
    "1001010110100000000000000000001011011",
    "0110101011000000000000000000011110100",
    "1011011101100000000000000000010101010",
    "0010101000100000000000000000011100111",
    "1101100111000000000000000000010110010",
    "0100010000100000000000000000001011101",
    "1011011101010101110101101010110001010",
    "0110101011101010001011010011001011011",
    "1001001110010111010100101100111001001",
    "0011010010110010101011010110010101101",
    "1100111101001101010100110011011110010",
    "0000000011100110101111001111100000000",
    "1111111010110010101011010110110000000",
    "1000001001101101010100110011010000000",
    "1011101011010010101011010110110000000",
    "1011101000101101010100110011010000000",
    "1011101011010010101011010110110000000",
    "1000001000111011010100110011010000000",
    "1111111011000100101011010110110000000"
  ];

  ctx.fillStyle = paymeRed;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
        continue;
      }
      const dist = Math.hypot(r - 18, c - 18);
      if (dist <= 6.5) {
        continue;
      }
      // Bottom-right PayMe badge area
      if (r >= modules - 8 && c >= modules - 8) {
        continue;
      }
      if (grid[r] && grid[r][c] === '1') {
        const cx = margin + c * modSize + modSize / 2;
        const cy = margin + r * modSize + modSize / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 3 Finders
  drawFinder(ctx, margin, margin, 7 * modSize, paymeRed, '#ffffff', true);
  drawFinder(ctx, margin + (modules - 7) * modSize, margin, 7 * modSize, paymeRed, '#ffffff', true);
  drawFinder(ctx, margin, margin + (modules - 7) * modSize, 7 * modSize, paymeRed, '#ffffff', true);

  // Center Blossom Photo in circle
  const avatarRadius = 66;
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.clip();

  // Natural Cherry Blossom Photo Background
  const grad = ctx.createLinearGradient(size/2 - 60, size/2 - 60, size/2 + 60, size/2 + 60);
  grad.addColorStop(0, '#538bc7');
  grad.addColorStop(0.5, '#7caee4');
  grad.addColorStop(1, '#a6cbf0');
  ctx.fillStyle = grad;
  ctx.fillRect(size/2 - 80, size/2 - 80, 160, 160);

  // Branches
  ctx.strokeStyle = '#422a1d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(size/2 - 50, size/2 - 20);
  ctx.quadraticCurveTo(size/2 - 10, size/2 - 5, size/2 + 40, size/2 - 40);
  ctx.stroke();

  // Multiple realistic white-pink sakura blossoms
  const petals = [
    { x: size/2 - 20, y: size/2 - 2, scale: 1.1 },
    { x: size/2 + 10, y: size/2 - 12, scale: 1.25 },
    { x: size/2 - 5, y: size/2 + 18, scale: 1.05 },
    { x: size/2 + 25, y: size/2 + 12, scale: 0.9 },
    { x: size/2 - 35, y: size/2 + 10, scale: 0.8 },
  ];

  petals.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.scale, p.scale);
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 14, Math.sin(angle) * 14, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 4;
      ctx.fill();
    }
    // Sakura Center
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fca5a5';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();

  // White border
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, avatarRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.stroke();

  // PayMe Red Badge at bottom right corner
  const badgeX = margin + (modules - 7) * modSize;
  const badgeY = margin + (modules - 7) * modSize;
  const badgeSize = 7 * modSize;
  ctx.fillStyle = paymeRed;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 14);
  ctx.fill();

  // PayMe stylized 'P' loop
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const bx = badgeX + badgeSize / 2;
  const by = badgeY + badgeSize / 2;
  ctx.arc(bx, by - 5, 12, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(bx - 12, by + 7);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx - 12, by - 17);
  ctx.lineTo(bx - 12, by + 19);
  ctx.stroke();

  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

// 3. AlipayHK
function generateAlipayHK() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const margin = 30;
  const gridW = size - margin * 2;
  const modules = 37;
  const modSize = gridW / modules;

  const grid = [
    "1111111010101111110101010010101111111",
    "1000001011110101011010101101101000001",
    "1011101001011011011011011011001011101",
    "1011101010110101011010101101101011101",
    "1011101001011011011011011011001011101",
    "1000001011110101011010101101101000001",
    "1111111010101010101010101010101111111",
    "0000000000000000000000000000000000000",
    "1110010100011110001100001111001000100",
    "1001101101101000010011111101111101011",
    "0110010010101101110010110010011101010",
    "1011001110100011011010100011110011111",
    "1110100111010101101011101011011101100",
    "0010010000000000000000000000010010010",
    "1000101101000000000000000000010110110",
    "1101111100100000000000000000011010111",
    "0100101011100000000000000000001110001",
    "1011111101000000000000000000000100101",
    "1001010110100000000000000000001011011",
    "0110101011000000000000000000011110100",
    "1011011101100000000000000000010101010",
    "0010101000100000000000000000011100111",
    "1101100111000000000000000000010110010",
    "0100010000100000000000000000001011101",
    "1011011101010101110101101010110001010",
    "0110101011101010001011010011001011011",
    "1001001110010111010100101100111001001",
    "0011010010110010101011010110010101101",
    "1100111101001101010100110011011110010",
    "0000000011100110101111001111101010101",
    "1111111010110010101011010110110001110",
    "1000001001101101010100110011010110001",
    "1011101011010010101011010110111011010",
    "1011101000101101010100110011010100101",
    "1011101011010010101011010110111101110",
    "1000001000111011010100110011010010011",
    "1111111011000100101011010110111111000"
  ];

  ctx.fillStyle = '#000000';
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
        continue;
      }
      const dist = Math.hypot(r - 18, c - 18);
      if (dist <= 6.2) {
        continue;
      }
      if (grid[r] && grid[r][c] === '1') {
        ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize + 0.4, modSize + 0.4);
      }
    }
  }

  // Finders
  drawFinder(ctx, margin, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin + (modules - 7) * modSize, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin, margin + (modules - 7) * modSize, 7 * modSize, '#000000', '#ffffff', false);

  // Center 3 Peaches in mesh foam Photo Circle
  const avatarRadius = 66;
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.clip();

  // Dark slate table surface
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(size/2 - 80, size/2 - 80, 160, 160);

  // 3 Peaches with soft gradients and foam nets
  // Peach 1 (Top Right)
  ctx.save();
  const p1Grad = ctx.createRadialGradient(size/2 + 16, size/2 - 16, 4, size/2 + 16, size/2 - 14, 28);
  p1Grad.addColorStop(0, '#fef08a');
  p1Grad.addColorStop(0.4, '#f87171');
  p1Grad.addColorStop(1, '#e11d48');
  ctx.fillStyle = p1Grad;
  ctx.beginPath();
  ctx.arc(size/2 + 16, size/2 - 14, 25, 0, Math.PI * 2);
  ctx.fill();
  // Mesh net
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(size/2 + 16, size/2 - 14, 27, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Peach 2 (Left)
  ctx.save();
  const p2Grad = ctx.createRadialGradient(size/2 - 20, size/2 + 4, 4, size/2 - 18, size/2 + 6, 28);
  p2Grad.addColorStop(0, '#fef9c3');
  p2Grad.addColorStop(0.45, '#fb923c');
  p2Grad.addColorStop(0.85, '#ef4444');
  p2Grad.addColorStop(1, '#b91c1c');
  ctx.fillStyle = p2Grad;
  ctx.beginPath();
  ctx.arc(size/2 - 18, size/2 + 6, 26, 0, Math.PI * 2);
  ctx.fill();
  // Mesh net
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(size/2 - 18, size/2 + 6, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Peach 3 (Bottom Right)
  ctx.save();
  const p3Grad = ctx.createRadialGradient(size/2 + 12, size/2 + 22, 4, size/2 + 14, size/2 + 24, 28);
  p3Grad.addColorStop(0, '#fed7aa');
  p3Grad.addColorStop(0.4, '#f43f5e');
  p3Grad.addColorStop(1, '#9f1239');
  ctx.fillStyle = p3Grad;
  ctx.beginPath();
  ctx.arc(size/2 + 14, size/2 + 24, 26, 0, Math.PI * 2);
  ctx.fill();
  // Mesh net
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(size/2 + 14, size/2 + 24, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();

  // White avatar border
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, avatarRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.stroke();

  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

// 4. WeChat Pay
function generateWeChatPay() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const margin = 30;
  const gridW = size - margin * 2;
  const modules = 37;
  const modSize = gridW / modules;

  const grid = [
    "1111111010101111110101010010101111111",
    "1000001011110101011010101101101000001",
    "1011101001011011011011011011001011101",
    "1011101010110101011010101101101011101",
    "1011101001011011011011011011001011101",
    "1000001011110101011010101101101000001",
    "1111111010101010101010101010101111111",
    "0000000000000000000000000000000000000",
    "1110010100011110001100001111001000100",
    "1001101101101000010011111101111101011",
    "0110010010101101110010110010011101010",
    "1011001110100011011010100011110011111",
    "1110100111010101101011101011011101100",
    "0010010000000000000000000000010010010",
    "1000101101000000000000000000010110110",
    "1101111100100000000000000000011010111",
    "0100101011100000000000000000001110001",
    "1011111101000000000000000000000100101",
    "1001010110100000000000000000001011011",
    "0110101011000000000000000000011110100",
    "1011011101100000000000000000010101010",
    "0010101000100000000000000000011100111",
    "1101100111000000000000000000010110010",
    "0100010000100000000000000000001011101",
    "1011011101010101110101101010110001010",
    "0110101011101010001011010011001011011",
    "1001001110010111010100101100111001001",
    "0011010010110010101011010110010101101",
    "1100111101001101010100110011011110010",
    "0000000011100110101111001111101010101",
    "1111111010110010101011010110110001110",
    "1000001001101101010100110011010110001",
    "1011101011010010101011010110111011010",
    "1011101000101101010100110011010010101",
    "1011101011010010101011010110111101110",
    "1000001000111011010100110011010010011",
    "1111111011000100101011010110111111000"
  ];

  ctx.fillStyle = '#000000';
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
        continue;
      }
      if (r >= 12 && r <= 24 && c >= 12 && c <= 24) {
        continue;
      }
      if (grid[r] && grid[r][c] === '1') {
        ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize + 0.4, modSize + 0.4);
      }
    }
  }

  // Finders
  drawFinder(ctx, margin, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin + (modules - 7) * modSize, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin, margin + (modules - 7) * modSize, 7 * modSize, '#000000', '#ffffff', false);

  // Center Character Card
  const boxW = 12 * modSize;
  const boxH = 12 * modSize;
  const bx = margin + 12.5 * modSize;
  const by = margin + 12.5 * modSize;

  ctx.save();
  roundRect(ctx, bx, by, boxW, boxH, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.clip();

  // Background room
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(bx, by, boxW, boxH);

  // Doll Character
  // Pink Hat / Bonnet
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(size/2, size/2 - 14, 46, Math.PI, 0);
  ctx.fill();

  // Yellow Hair
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(size/2, size/2 - 6, 38, 0, Math.PI * 2);
  ctx.fill();

  // Small black hair ribbon
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(size/2 + 10, size/2 - 20, 5, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(size/2, size/2, 28, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Happy Smile
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(size/2 - 10, size/2 - 2, 3.5, 0, Math.PI * 2);
  ctx.arc(size/2 + 10, size/2 - 2, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(size/2 - 16, size/2 + 6, 5, 0, Math.PI * 2);
  ctx.arc(size/2 + 16, size/2 + 6, 5, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.arc(size/2, size/2 + 6, 8, 0, Math.PI);
  ctx.fill();

  // Pink Clothes
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(size/2 - 26, size/2 + 28, 52, 40);

  ctx.restore();

  // White Card border
  roundRect(ctx, bx, by, boxW, boxH, 16);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Green WeChat Pay Checkmark Badge
  const badgeX = bx + boxW - 18;
  const badgeY = by + boxH - 18;
  const badgeR = 24;

  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeR - 3, 0, Math.PI * 2);
  ctx.fillStyle = '#07c160';
  ctx.fill();

  // White Checkmark
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(badgeX - 9, badgeY);
  ctx.lineTo(badgeX - 2, badgeY + 7);
  ctx.lineTo(badgeX + 10, badgeY - 6);
  ctx.stroke();

  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

const jpg1 = generatePayPal();
const jpg2 = generatePayMe();
const jpg3 = generateAlipayHK();
const jpg4 = generateWeChatPay();

DIRS.forEach(dir => {
  fs.writeFileSync(path.join(dir, 'paypal.jpg'), jpg1);
  fs.writeFileSync(path.join(dir, 'payme.jpg'), jpg2);
  fs.writeFileSync(path.join(dir, 'alipayhk.jpg'), jpg3);
  fs.writeFileSync(path.join(dir, 'wechatpay.jpg'), jpg4);
  fs.writeFileSync(path.join(dir, 'wechat pay.jpg'), jpg4);

  fs.writeFileSync(path.join(dir, 'paypal.png'), jpg1);
  fs.writeFileSync(path.join(dir, 'payme.png'), jpg2);
  fs.writeFileSync(path.join(dir, 'alipayhk.png'), jpg3);
  fs.writeFileSync(path.join(dir, 'wechatpay.png'), jpg4);
});

console.log('✅ Generated original JPG and PNG assets successfully across all folders!');
