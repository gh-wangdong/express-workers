import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import middleware from '../index.js';

const file = join(import.meta.dirname, 'code.js');
const code = readFileSync(file, 'utf-8');

createServer(middleware(code, { echo: console.log })).listen(3000, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:3000`);
});
