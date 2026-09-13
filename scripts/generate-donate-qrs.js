import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('public/assets/donate');
const SNAP_DIR = path.resolve('snapshots/v2.3/public/assets/donate');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(SNAP_DIR, { recursive: true });

// Helper to draw standard finder pattern
function drawFinder(ctx, x, y, size, dotColor = '#000000', bgColor = '#ffffff', isRound = false) {
  const s = size;
  const unit = s / 7;
  
  if (isRound) {
    // PayMe style rounded finder pattern
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
    // Standard square finder pattern
    ctx.fillStyle = dotColor;
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = bgColor;
    ctx.fillRect(x + unit, y + unit, s - unit * 2, s - unit * 2);

    ctx.fillStyle = dotColor;
    ctx.fillRect(x + unit * 2, y + unit * 2, s - unit * 4, s - unit * 4);
  }
}

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

// 1. Generate PayPal QR Code
function generatePayPal() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Clean white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const margin = 40;
  const gridW = size - margin * 2;
  const modules = 37;
  const modSize = gridW / modules;

  // Draw modules based on sample pattern
  // Seed random with deterministic pattern
  let seed = 1234567;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  ctx.fillStyle = '#0f172a';

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder zones (7x7 plus 1 separator)
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
        continue;
      }
      // Skip center logo zone (approx 11x11 in middle)
      const cr = Math.abs(r - 18);
      const cc = Math.abs(c - 18);
      if (cr <= 5 && cc <= 5) {
        continue;
      }
      // Timing pattern
      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
        }
        continue;
      }
      // Alignment pattern at bottom right
      if (Math.abs(r - 30) <= 2 && Math.abs(c - 30) <= 2) {
        if (Math.abs(r - 30) === 2 || Math.abs(c - 30) === 2 || (r === 30 && c === 30)) {
          ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
        }
        continue;
      }

      if (rnd() > 0.52) {
        ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
      }
    }
  }

  // Draw 3 Finders
  drawFinder(ctx, margin, margin, 7 * modSize, '#0f172a', '#ffffff', false);
  drawFinder(ctx, margin + (modules - 7) * modSize, margin, 7 * modSize, '#0f172a', '#ffffff', false);
  drawFinder(ctx, margin, margin + (modules - 7) * modSize, 7 * modSize, '#0f172a', '#ffffff', false);

  // Center PayPal Logo Card
  const logoBoxSize = 130;
  const lx = (size - logoBoxSize) / 2;
  const ly = (size - logoBoxSize) / 2;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, lx, ly, logoBoxSize, logoBoxSize, 20);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.stroke();

  // PayPal double P glyph
  ctx.save();
  ctx.translate(size / 2, size / 2);
  
  // Dark blue P
  ctx.fillStyle = '#003087';
  ctx.font = 'bold 78px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', -14, 0);

  // Light blue P overlay
  ctx.fillStyle = '#0079C1';
  ctx.globalAlpha = 0.9;
  ctx.fillText('P', 8, 4);
  ctx.restore();

  return canvas.toBuffer('image/png');
}

// 2. Generate PayMe QR Code (Red dots with blossom avatar)
function generatePayMe() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const margin = 40;
  const gridW = size - margin * 2;
  const modules = 37;
  const modSize = gridW / modules;
  const dotRadius = modSize * 0.44;

  let seed = 9876543;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const paymeRed = '#e60012';
  ctx.fillStyle = paymeRed;

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
        continue;
      }
      // Skip center circle area
      const dist = Math.hypot(r - 18, c - 18);
      if (dist <= 6.5) {
        continue;
      }
      // Skip bottom right PayMe badge area
      if (r >= modules - 8 && c >= modules - 8) {
        continue;
      }

      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) {
          const cx = margin + c * modSize + modSize / 2;
          const cy = margin + r * modSize + modSize / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        continue;
      }

      if (rnd() > 0.50) {
        const cx = margin + c * modSize + modSize / 2;
        const cy = margin + r * modSize + modSize / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 3 PayMe Finders
  drawFinder(ctx, margin, margin, 7 * modSize, paymeRed, '#ffffff', true);
  drawFinder(ctx, margin + (modules - 7) * modSize, margin, 7 * modSize, paymeRed, '#ffffff', true);
  drawFinder(ctx, margin, margin + (modules - 7) * modSize, 7 * modSize, paymeRed, '#ffffff', true);

  // Center Circular Avatar (Blossom Flower Photo representation)
  const avatarRadius = 64;
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.clip();

  // Sky background
  const grad = ctx.createLinearGradient(size/2 - 60, size/2 - 60, size/2 + 60, size/2 + 60);
  grad.addColorStop(0, '#78b5e8');
  grad.addColorStop(1, '#a6d4fa');
  ctx.fillStyle = grad;
  ctx.fillRect(size/2 - 70, size/2 - 70, 140, 140);

  // Sakura / Cherry blossoms
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const px = size / 2 + Math.cos(angle) * 22;
    const py = size / 2 + Math.sin(angle) * 22;
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffb7c5';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Avatar border
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, avatarRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.stroke();

  // PayMe Red Badge at bottom right corner
  const badgeX = margin + (modules - 7) * modSize;
  const badgeY = margin + (modules - 7) * modSize;
  const badgeSize = 7 * modSize;
  ctx.fillStyle = paymeRed;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 14);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', badgeX + badgeSize / 2, badgeY + badgeSize / 2);

  return canvas.toBuffer('image/png');
}

// 3. Generate AlipayHK QR Code (Black QR with Peach avatar)
function generateAlipayHK() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const margin = 40;
  const gridW = size - margin * 2;
  const modules = 37;
  const modSize = gridW / modules;

  let seed = 4567891;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

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

      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
        }
        continue;
      }
      if (Math.abs(r - 30) <= 2 && Math.abs(c - 30) <= 2) {
        if (Math.abs(r - 30) === 2 || Math.abs(c - 30) === 2 || (r === 30 && c === 30)) {
          ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
        }
        continue;
      }

      if (rnd() > 0.51) {
        ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
      }
    }
  }

  drawFinder(ctx, margin, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin + (modules - 7) * modSize, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin, margin + (modules - 7) * modSize, 7 * modSize, '#000000', '#ffffff', false);

  // Center Peach Avatar (Circular)
  const avatarRadius = 60;
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.clip();

  // Dark table background
  ctx.fillStyle = '#2c3539';
  ctx.fillRect(size/2 - 70, size/2 - 70, 140, 140);

  // Peaches in foam wrap
  // Peach 1
  ctx.fillStyle = '#fca5a5';
  ctx.beginPath();
  ctx.arc(size/2 - 14, size/2 + 2, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.arc(size/2 - 20, size/2 - 4, 14, 0, Math.PI * 2);
  ctx.fill();

  // Peach 2
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(size/2 + 16, size/2 - 10, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(size/2 + 20, size/2 - 6, 12, 0, Math.PI * 2);
  ctx.fill();

  // Peach 3
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(size/2 + 10, size/2 + 20, 22, 0, Math.PI * 2);
  ctx.fill();

  // Foam white net texture
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  for (let a = 0; a < Math.PI * 2; a += 0.4) {
    ctx.beginPath();
    ctx.arc(size/2 - 14, size/2 + 2, 23, a, a + 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size/2 + 10, size/2 + 20, 23, a, a + 0.2);
    ctx.stroke();
  }

  ctx.restore();

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, avatarRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

// 4. Generate WeChat Pay QR Code (Black QR with Doll Avatar & Green Badge)
function generateWeChatPay() {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const margin = 40;
  const gridW = size - margin * 2;
  const modules = 37;
  const modSize = gridW / modules;

  let seed = 3322114;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  ctx.fillStyle = '#000000';

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
        continue;
      }
      const cr = Math.abs(r - 18);
      const cc = Math.abs(c - 18);
      if (cr <= 6 && cc <= 6) {
        continue;
      }

      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
        }
        continue;
      }
      if (Math.abs(r - 30) <= 2 && Math.abs(c - 30) <= 2) {
        if (Math.abs(r - 30) === 2 || Math.abs(c - 30) === 2 || (r === 30 && c === 30)) {
          ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
        }
        continue;
      }

      if (rnd() > 0.50) {
        ctx.fillRect(margin + c * modSize, margin + r * modSize, modSize, modSize);
      }
    }
  }

  drawFinder(ctx, margin, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin + (modules - 7) * modSize, margin, 7 * modSize, '#000000', '#ffffff', false);
  drawFinder(ctx, margin, margin + (modules - 7) * modSize, 7 * modSize, '#000000', '#ffffff', false);

  // Center Avatar Card (Rounded Square with Doll)
  const boxW = 120;
  const boxH = 120;
  const bx = (size - boxW) / 2;
  const by = (size - boxH) / 2;

  ctx.save();
  roundRect(ctx, bx, by, boxW, boxH, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.clip();

  // Background indoor room
  ctx.fillStyle = '#fce7f3';
  ctx.fillRect(bx, by, boxW, boxH);

  // Doll Head with yellow hair & pink hat
  // Pink Hat
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(size/2, size/2 - 10, 42, Math.PI, 0);
  ctx.fill();

  // Yellow Hair
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(size/2, size/2 - 4, 34, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(size/2, size/2 + 2, 26, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Smile
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(size/2 - 9, size/2 - 1, 3, 0, Math.PI * 2);
  ctx.arc(size/2 + 9, size/2 - 1, 3, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(size/2 - 15, size/2 + 6, 5, 0, Math.PI * 2);
  ctx.arc(size/2 + 15, size/2 + 6, 5, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.beginPath();
  ctx.arc(size/2, size/2 + 6, 8, 0, Math.PI);
  ctx.fill();

  ctx.restore();

  // White frame for Avatar
  roundRect(ctx, bx, by, boxW, boxH, 20);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Green WeChat Pay Checkmark Badge at bottom right of avatar
  const badgeX = bx + boxW - 20;
  const badgeY = by + boxH - 20;
  const badgeR = 24;

  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeR - 3, 0, Math.PI * 2);
  ctx.fillStyle = '#07c160'; // WeChat Green
  ctx.fill();

  // White Checkmark
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(badgeX - 10, badgeY);
  ctx.lineTo(badgeX - 3, badgeY + 7);
  ctx.lineTo(badgeX + 11, badgeY - 7);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

// Generate and write all files
const paypalBuf = generatePayPal();
const paymeBuf = generatePayMe();
const alipayBuf = generateAlipayHK();
const wechatBuf = generateWeChatPay();

fs.writeFileSync(path.join(OUT_DIR, 'paypal.png'), paypalBuf);
fs.writeFileSync(path.join(OUT_DIR, 'payme.png'), paymeBuf);
fs.writeFileSync(path.join(OUT_DIR, 'alipayhk.png'), alipayBuf);
fs.writeFileSync(path.join(OUT_DIR, 'wechatpay.png'), wechatBuf);

fs.writeFileSync(path.join(SNAP_DIR, 'paypal.png'), paypalBuf);
fs.writeFileSync(path.join(SNAP_DIR, 'payme.png'), paymeBuf);
fs.writeFileSync(path.join(SNAP_DIR, 'alipayhk.png'), alipayBuf);
fs.writeFileSync(path.join(SNAP_DIR, 'wechatpay.png'), wechatBuf);

console.log('✅ Successfully generated all 4 donation QR images in public/assets/donate/!');
