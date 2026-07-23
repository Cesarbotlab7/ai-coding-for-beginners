import { spawnSync } from 'node:child_process';

const checks = [
  ['run', 'test:unit'],
  ['run', 'build'],
  ['run', 'test:e2e'],
];

for (const args of checks) {
  const result = spawnSync('npm', args, { stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
