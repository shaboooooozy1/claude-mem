import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

describe('Windows build workflow', () => {
  it('pins the runner to the Visual Studio 2022 image supported by node-gyp', () => {
    const workflow = readFileSync(path.join(projectRoot, '.github/workflows/windows.yml'), 'utf-8');

    expect(workflow).toMatch(/^\s+runs-on: windows-2022\s*$/m);
    expect(workflow).not.toContain('windows-latest');
  });

  it('limits the build token to read-only repository contents', () => {
    const workflow = readFileSync(path.join(projectRoot, '.github/workflows/windows.yml'), 'utf-8');

    expect(workflow).toMatch(/^    permissions:\r?\n      contents: read\s*$/m);
  });
});
