import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const configPath = path.join(root, 'app.config.ts');
const config = fs.readFileSync(configPath, 'utf8');

const errors = [];
const requiredMetadata = [
  ['appName', /appName:\s*"([^"]+)"/, (value) => value && !value.includes('{{')],
  ['appSlug', /appSlug:\s*"([^"]+)"/, (value) => value && !value.includes('{{')],
  ['logoUrl', /logoUrl:\s*"([^"]+)"/, (value) => value && value.trim().length > 0],
];

for (const [name, pattern, isValid] of requiredMetadata) {
  const value = config.match(pattern)?.[1] ?? '';
  if (!isValid(value)) errors.push(`${name} is missing, empty, or still contains a template placeholder`);
}

const assets = [
  ['./assets/images/icon.png', [1024, 1024]],
  ['./assets/images/splash-icon.png', [1024, 1024]],
  ['./assets/images/favicon.png', [48, 48]],
  ['./assets/images/android-icon-foreground.png', [512, 512]],
  ['./assets/images/android-icon-background.png', [512, 512]],
  ['./assets/images/android-icon-monochrome.png', [432, 432]],
];

function pngDimensions(filePath) {
  const bytes = fs.readFileSync(filePath);
  if (bytes.length < 24 || bytes.readUInt32BE(0) !== 0x89504e47 || bytes.readUInt32BE(4) !== 0x0d0a1a0a) return null;
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

for (const [relativePath, expected] of assets) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    errors.push(`missing branding asset: ${relativePath}`);
    continue;
  }
  const actual = pngDimensions(filePath);
  if (!actual || actual[0] !== expected[0] || actual[1] !== expected[1]) {
    errors.push(`${relativePath} must be a PNG with dimensions ${expected.join('x')}`);
  }
}

for (const placeholder of ['{{project_title}}', '{{project_name}}', '{{bundle_id}}', 'TO_BE_REPLACED']) {
  if (config.includes(placeholder)) errors.push(`app.config.ts contains forbidden placeholder: ${placeholder}`);
}

const result = { ok: errors.length === 0, errors, checkedAssets: assets.length };
if (process.env.BRANDING_JSON === '1') {
  console.log(JSON.stringify(result));
} else if (result.ok) {
  console.log(`Branding check passed for ${result.checkedAssets} assets.`);
} else {
  console.error(['Branding check failed:', ...errors.map((error) => `- ${error}`)].join('\n'));
}
process.exitCode = result.ok ? 0 : 1;
