import { writeFileSync } from 'fs';
import { join } from 'path';

console.log('🎨 Generating PWA icons for SchoolConnect...');

// Create simple SVG icons for PWA
function createSVGIcon(size, filename) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size/10}" fill="url(#grad${size})"/>
  <g transform="translate(${size/2}, ${size/2})" fill="white">
    <rect x="-${size/4}" y="-${size/6}" width="${size/2}" height="${size/3}" rx="${size/32}"/>
    <path d="M -${size/3} -${size/6} L 0 -${size/3} L ${size/3} -${size/6}" />
    <rect x="-${size/12}" y="-${size/12}" width="${size/6}" height="${size/8}" rx="${size/64}" fill="#3b82f6"/>
    <circle cx="0" cy="-${size/2.5}" r="${size/32}"/>
    <circle cx="0" cy="-${size/2.5}" r="${size/16}" fill="none" stroke="white" stroke-width="${size/128}"/>
  </g>
  <text x="${size/2}" y="${size*0.85}" text-anchor="middle" fill="white" font-size="${size/16}" font-weight="bold" font-family="system-ui, sans-serif">
    SC
  </text>
</svg>`;
  
  writeFileSync(join(process.cwd(), 'public', filename), svg);
  console.log(`✅ Created ${filename} (${size}x${size})`);
}

// Generate all required icons
createSVGIcon(192, 'logo-192.png');
createSVGIcon(512, 'logo-512.png');
createSVGIcon(192, 'logo-192-maskable.png');
createSVGIcon(512, 'logo-512-maskable.png');

console.log('🎉 PWA icons generated successfully!');
console.log('📱 Your SchoolConnect PWA is ready for deployment!');
