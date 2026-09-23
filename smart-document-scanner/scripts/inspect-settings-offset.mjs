import fs from 'node:fs';
const text = fs.readFileSync('app/(tabs)/settings.tsx', 'utf8');
const offset = 31444;
console.log(text.slice(Math.max(0, offset - 500), offset + 700));
