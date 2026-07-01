// Patches Payload internals that break in non-interactive (CI/Vercel) environments

const fs = require('fs')
const path = require('path')

// Patch 1: loadEnv.js — @next/env CJS/ESM interop bug on Node 20+
const loadEnvFile = path.join(__dirname, '..', 'node_modules', 'payload', 'dist', 'bin', 'loadEnv.js')
if (fs.existsSync(loadEnvFile)) {
  let c = fs.readFileSync(loadEnvFile, 'utf8')
  if (!c.includes('nextEnvImport.default ?? nextEnvImport')) {
    c = c
      .replace("import nextEnvImport from '@next/env';", "import * as nextEnvImport from '@next/env';")
      .replace('const { loadEnvConfig } = nextEnvImport;', 'const { loadEnvConfig } = nextEnvImport.default ?? nextEnvImport;')
    fs.writeFileSync(loadEnvFile, c)
    console.log('[patch] Fixed payload/dist/bin/loadEnv.js')
  } else {
    console.log('[patch] loadEnv.js already patched')
  }
}

// Patch 2: pushDevSchema.js — interactive prompts hang in CI (no TTY)
// When stdin is not a TTY, prompts() returns {confirm: undefined}.
// Original code: if (!acceptWarnings) { process.exit(0) }
// Fix: only exit if explicitly false (user typed N), not when undefined (no TTY)
const pushFile = path.join(__dirname, '..', 'node_modules', '@payloadcms', 'drizzle', 'dist', 'utilities', 'pushDevSchema.js')
if (fs.existsSync(pushFile)) {
  let c = fs.readFileSync(pushFile, 'utf8')
  if (!c.includes('acceptWarnings === false')) {
    c = c
      .replace('if (!acceptWarnings) {', 'if (acceptWarnings === false) {')
      .replace('initial: false,', 'initial: true,')
    fs.writeFileSync(pushFile, c)
    console.log('[patch] Fixed @payloadcms/drizzle pushDevSchema.js (CI non-interactive mode)')
  } else {
    console.log('[patch] pushDevSchema.js already patched')
  }
}
