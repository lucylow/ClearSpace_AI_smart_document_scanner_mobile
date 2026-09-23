import { spawnSync } from 'node:child_process';
import { compatibilityCheckFailure, compatibilityCheckResult, compatibilityCheckSummary } from './expo-compatibility-policy.mjs';

const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const result = spawnSync(command, ['exec', 'expo', 'install', '--check'], {
  cwd: process.cwd(),
  input: 'n\n',
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'pipe'],
});

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
const policy = compatibilityCheckResult(result.status, output);
if (process.env.EXPO_COMPATIBILITY_JSON === '1') {
  process.stdout.write(`${JSON.stringify(policy)}\n`);
} else {
  process.stdout.write(output);
}

if (result.error) {
  console.error(`Expo compatibility check could not start: ${result.error.message}`);
  process.exit(1);
}

if (compatibilityCheckFailure(result.status, output)) {
  console.error(compatibilityCheckSummary(result.status, output));
  process.exit(1);
}

console.log(compatibilityCheckSummary(result.status, output));
