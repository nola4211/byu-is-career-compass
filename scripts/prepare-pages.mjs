import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist', 'client');
const interviewDirectory = join(outputDirectory, 'interview');
const prefixedAssetDirectory = join(outputDirectory, 'byu-is-career-compass');

await cp(prefixedAssetDirectory, outputDirectory, { recursive: true, force: true });
await rm(prefixedAssetDirectory, { recursive: true, force: true });
await mkdir(interviewDirectory, { recursive: true });
await copyFile(
  join(outputDirectory, 'interview.html'),
  join(interviewDirectory, 'index.html'),
);
await writeFile(join(outputDirectory, '.nojekyll'), '');
