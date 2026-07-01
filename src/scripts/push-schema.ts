/**
 * Runs before next build on Vercel to push Payload schema changes to Neon.
 * Called via: NODE_ENV=development tsx src/scripts/push-schema.ts
 *
 * Patches are applied inline because Vercel caches node_modules and
 * postinstall may be skipped on repeat builds with unchanged lockfile.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function applyPatches() {
  const root = process.cwd()

  // Patch 1: loadEnv.js — @next/env CJS/ESM interop bug on Node 20+
  const loadEnvFile = resolve(root, 'node_modules/payload/dist/bin/loadEnv.js')
  if (existsSync(loadEnvFile)) {
    let c = readFileSync(loadEnvFile, 'utf8')
    if (!c.includes('nextEnvImport.default ?? nextEnvImport')) {
      c = c
        .replace("import nextEnvImport from '@next/env';", "import * as nextEnvImport from '@next/env';")
        .replace('const { loadEnvConfig } = nextEnvImport;', 'const { loadEnvConfig } = nextEnvImport.default ?? nextEnvImport;')
      writeFileSync(loadEnvFile, c)
      console.log('[push-schema] Patched loadEnv.js')
    } else {
      console.log('[push-schema] loadEnv.js already patched')
    }
  } else {
    console.log('[push-schema] loadEnv.js not found, skipping')
  }

  // Patch 2: pushDevSchema.js — prompts() returns undefined in CI (no TTY)
  // Without this patch, if there are warnings, pushDevSchema exits silently.
  const pushFile = resolve(root, 'node_modules/@payloadcms/drizzle/dist/utilities/pushDevSchema.js')
  if (existsSync(pushFile)) {
    let c = readFileSync(pushFile, 'utf8')
    if (!c.includes('acceptWarnings === false')) {
      c = c
        .replace('if (!acceptWarnings) {', 'if (acceptWarnings === false) {')
        .replace('initial: false,', 'initial: true,')
      writeFileSync(pushFile, c)
      console.log('[push-schema] Patched pushDevSchema.js')
    } else {
      console.log('[push-schema] pushDevSchema.js already patched')
    }
  } else {
    console.log('[push-schema] pushDevSchema.js not found, skipping')
  }
}

async function main() {
  console.log('[push-schema] Starting. NODE_ENV:', process.env.NODE_ENV)
  console.log('[push-schema] POSTGRES_URL present:', !!process.env.POSTGRES_URL)

  applyPatches()

  console.log('[push-schema] Loading Payload...')
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')

  console.log('[push-schema] Calling getPayload (triggers schema push)...')
  const payload = await getPayload({ config })
  console.log('[push-schema] Schema push complete!')

  await (payload.db as { destroy?: () => Promise<void> }).destroy?.()
  process.exit(0)
}

main().catch(err => {
  console.error('[push-schema] FAILED:', err)
  process.exit(1)
})
