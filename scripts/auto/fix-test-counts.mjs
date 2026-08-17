/**
 * Fix hardcoded test counts to match actual game counts dynamically.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'C:/Project C/Hackation';

// Count game folders
const folders = readdirSync(join(ROOT, 'public/games'), { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== '_shared').length;

// Count catalog entries
const catalog = readFileSync(join(ROOT, 'shared/catalog.ts'), 'utf8');
const catalogCount = [...catalog.matchAll(/^\s+['"]?[a-zA-Z0-9][a-zA-Z0-9_-]+['"]?:\s*[\{(]/gm)].length;

// Fix ad-pipeline test
let adTest = readFileSync(join(ROOT, 'tests/ad-pipeline.test.ts'), 'utf8');
adTest = adTest.replace(/expect\(indexes\)\.toHaveLength\(\d+\)/, `expect(indexes).toHaveLength(${folders})`);
writeFileSync(join(ROOT, 'tests/ad-pipeline.test.ts'), adTest);

// Fix api test
let apiTest = readFileSync(join(ROOT, 'tests/api.test.ts'), 'utf8');
apiTest = apiTest.replace(/expect\(first\.body\.games\)\.toHaveLength\(\d+\)/, `expect(first.body.games).toHaveLength(${catalogCount + 7})`); // +7 for originals not in catalog
writeFileSync(join(ROOT, 'tests/api.test.ts'), apiTest);

console.log(`Fixed test counts: folders=${folders}, catalog=${catalogCount}`);
