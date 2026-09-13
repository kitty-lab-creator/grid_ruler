import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

const OUT_DIRS = [
  path.resolve('public/assets/donate'),
  path.resolve('dist/assets/donate'),
  path.resolve('assets/donate'),
  path.resolve('snapshots/v2.3/public/assets/donate'),
];

OUT_DIRS.forEach(d => fs.mkdirSync(d, { recursive: true }));

console.log('Generating QR codes and verifying scan...');
