
import { defineConfig } from 'drizzle-kit';
import type { Config } from 'drizzle-kit';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

if (!process.env.DATABASE_URL) {
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, 'utf8');
    const match = envFile.match(/^DATABASE_URL="?(.+?)"?$/m);
    if (match?.[1]) {
      process.env.DATABASE_URL = match[1].trim();
    }
  }
}

const dbConfig: Config = defineConfig({
  schema: ['./src/db/schema.ts', './drizzle/schema.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});


export default dbConfig;