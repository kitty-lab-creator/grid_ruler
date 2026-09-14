const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const PAYPAL_URL = 'https://www.paypal.com/qrcodes/managed/16d4009f-428d-4b45-bcf6-bb7af15d9449?utm_source=consweb_more';

const TARGET_DIRS = [
  path.resolve('public/assets/donate'),
  path.resolve('assets/donate'),
  path.resolve('dist/assets/donate'),
];

TARGET_DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function generate() {
  const qrCanvas = createCanvas(800, 800);
  await QRCode.toCanvas(qrCanvas, PAYPAL_URL, {
    errorCorrectionLevel: 'H',
    margin: 3,
    width: 800,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  const ctx = qrCanvas.getContext('2d');

  // Center subtle rounded badge with official PayPal P icon for professional look, ensuring QR ECC H remains 100% valid
  const logoSize = 150;
  const lx = (800 - logoSize) / 2;
  const ly = (800 - logoSize) / 2;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const r = 24;
  ctx.moveTo(lx + r, ly);
  ctx.lineTo(lx + logoSize - r, ly);
  ctx.quadraticCurveTo(lx + logoSize, ly, lx + logoSize, ly + r);
  ctx.lineTo(lx + logoSize, ly + logoSize - r);
  ctx.quadraticCurveTo(lx + logoSize, ly + logoSize, lx + logoSize - r, ly + logoSize);
  ctx.lineTo(lx + r, ly + logoSize);
  ctx.quadraticCurveTo(lx, ly + logoSize, lx, ly + logoSize - r);
  ctx.lineTo(lx, ly + r);
  ctx.quadraticCurveTo(lx, ly, lx + r, ly);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#f1f5f9';
  ctx.stroke();

  // Official PayPal Double-P logo
  ctx.save();
  ctx.translate(lx + 28, ly + 18);
  ctx.scale(1.2, 1.2);

  // Dark Blue P
  ctx.fillStyle = '#003087';
  ctx.beginPath();
  ctx.moveTo(14, 80);
  ctx.lineTo(28, 12);
  ctx.lineTo(54, 12);
  ctx.bezierCurveTo(70, 12, 80, 20, 78, 33);
  ctx.bezierCurveTo(76, 47, 64, 54, 48, 54);
  ctx.lineTo(36, 54);
  ctx.lineTo(30, 80);
  ctx.closePath();
  ctx.fill();

  // Light Blue P
  ctx.fillStyle = '#0079C1';
  ctx.beginPath();
  ctx.moveTo(28, 92);
  ctx.lineTo(44, 26);
  ctx.lineTo(70, 26);
  ctx.bezierCurveTo(86, 26, 96, 34, 94, 47);
  ctx.bezierCurveTo(92, 61, 80, 68, 64, 68);
  ctx.lineTo(52, 68);
  ctx.lineTo(46, 92);
  ctx.closePath();
  ctx.fill();

  // Overlay P
  ctx.fillStyle = '#00457C';
  ctx.beginPath();
  ctx.moveTo(44, 26);
  ctx.lineTo(54, 26);
  ctx.bezierCurveTo(70, 26, 80, 34, 78, 47);
  ctx.bezierCurveTo(76, 55, 68, 61, 60, 64);
  ctx.lineTo(52, 68);
  ctx.lineTo(46, 92);
  ctx.lineTo(36, 54);
  ctx.lineTo(44, 26);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  ctx.restore();

  const pngBuffer = qrCanvas.toBuffer('image/png');
  const jpgBuffer = qrCanvas.toBuffer('image/jpeg', { quality: 0.98 });

  TARGET_DIRS.forEach(dir => {
    fs.writeFileSync(path.join(dir, 'paypal.png'), pngBuffer);
    fs.writeFileSync(path.join(dir, 'paypal.jpg'), jpgBuffer);
  });

  console.log('Saved PayPal QR (jpg & png) to all target directories.');
}

generate().catch(console.error);
