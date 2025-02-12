import express from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import middleware from '../index.js';

const file = join(import.meta.dirname, 'code.js');
const code = readFileSync(file, 'utf-8');

const app = express();
app.use(middleware(code, { echo: console.log }));
app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:3000`);
});
