/**
 * Runs before next build on Vercel to push Payload schema changes to Neon.
 * Called via: NODE_ENV=development tsx src/scripts/push-schema.ts
 *
 * Patches node_modules inline (Vercel caches node_modules, postinstall may be skipped).
 * On any error: logs and exits 0 so the build continues (runtime /rodonit-debug POST can push later).
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
  }

  // Patch 2: pushDevSchema.js — prompts() returns undefined in CI (no TTY)
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
  }
}

async function main() {
  console.log('[push-schema] Starting. NODE_ENV:', process.env.NODE_ENV)
  console.log('[push-schema] POSTGRES_URL present:', !!process.env.POSTGRES_URL)
  console.log('[push-schema] DATABASE_URL present:', !!process.env.DATABASE_URL)

  applyPatches()

  console.log('[push-schema] Loading Payload...')
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')

  console.log('[push-schema] Calling getPayload (triggers schema push)...')
  const payload = await getPayload({ config })
  console.log('[push-schema] getPayload complete — schema pushed!')

  await (payload.db as { destroy?: () => Promise<void> }).destroy?.()
}

main()
  .then(() => {
    console.log('[push-schema] Done.')
    process.exit(0)
  })
  .catch(err => {
    // Non-fatal: log and exit 0 so build continues
    // Use /rodonit-debug POST at runtime to push schema if this fails
    console.error('[push-schema] ERROR (non-fatal, build will continue):', err?.message ?? err)
    console.error('[push-schema] cause:', err?.cause)
    process.exit(0)
  })
