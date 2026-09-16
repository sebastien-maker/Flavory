// Generates favicons, manifest icons and the Organization logo from src/assets/brand.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const src = 'src/assets/brand/favicon-512.png';
await sharp(src).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(src).resize(512, 512).png().toFile('public/icon-512.png');
await sharp(src).resize(180, 180).png().toFile('public/apple-touch-icon.png');

// favicon.ico with one embedded 32x32 PNG.
const png32 = await sharp(src).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, png32]));

const b64 = (await sharp(src).resize(64, 64).png().toBuffer()).toString('base64');
await writeFile(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><image width="64" height="64" href="data:image/png;base64,${b64}"/></svg>`,
);

// 512x512 logo on white for Organization schema.
const logo = await sharp(await readFile('public/images/logo.svg'), { density: 600 })
  .resize(440)
  .png()
  .toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#ffffff' } })
  .composite([{ input: logo, gravity: 'center' }])
  .png()
  .toFile('public/logo.png');
console.log('icons written');
