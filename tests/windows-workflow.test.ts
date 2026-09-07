import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

const workflow = parse(readFileSync(
  join(import.meta.dir, '..', '.github', 'workflows', 'windows.yml'),
  'utf-8'
));
const commands = workflow.jobs.build.steps
  .map((step: { run?: string }) => step.run)
  .filter((run: string | undefined): run is string => Boolean(run));

describe('Windows build workflow', () => {
  it('skips native dependency install scripts in the build-only job', () => {
    const installs = commands.filter((run: string) => /^npm install\b/.test(run));
    expect(installs).toHaveLength(1);
    expect(installs[0].split(/\s+/)).toContain('--ignore-scripts');
  });

  it('still builds after installing dependencies', () => {
    const installIndex = commands.findIndex((run: string) => /^npm install\b/.test(run));
    expect(installIndex).toBeGreaterThanOrEqual(0);
    expect(commands.indexOf('npm run build')).toBeGreaterThan(installIndex);
  });
});
