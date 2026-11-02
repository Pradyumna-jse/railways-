import fs from 'fs';
import path from 'path';

/**
 * Robust data directory resolver that works across:
 * - Local dev (tsx / ts-node)
 * - Compiled Node.js (dist/index.js)
 * - Vercel Serverless Functions (api/index.ts)
 * - Docker / Render standalone containers
 */
export function resolveDataDir(customPath?: string): string {
  if (customPath && fs.existsSync(customPath)) {
    return customPath;
  }

  const candidates = [
    path.resolve(process.cwd(), 'data'),
    path.resolve(process.cwd(), 'server/data'),
    path.resolve(__dirname, '../../data'),
    path.resolve(__dirname, '../../../data'),
    path.resolve(__dirname, '../../server/data'),
    path.resolve(__dirname, '../data'),
    path.resolve(__dirname, './data')
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, 'station/nodes.json'))) {
        return candidate;
      }
    } catch {
      // Continue to next candidate
    }
  }

  return path.resolve(__dirname, '../../../data');
}

