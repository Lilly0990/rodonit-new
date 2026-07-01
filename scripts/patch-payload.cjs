// Patches Payload's loadEnv.js which breaks with @next/env ESM interop on Node 20+
const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '..', 'node_modules', 'payload', 'dist', 'bin', 'loadEnv.js')
if (!fs.existsSync(file)) { console.log('loadEnv.js not found, skipping patch'); process.exit(0) }
let c = fs.readFileSync(file, 'utf8')
if (c.includes('nextEnvImport.default ?? nextEnvImport')) { console.log('Already patched'); process.exit(0) }
c = c
  .replace("import nextEnvImport from '@next/env';", "import * as nextEnvImport from '@next/env';")
  .replace('const { loadEnvConfig } = nextEnvImport;', 'const { loadEnvConfig } = nextEnvImport.default ?? nextEnvImport;')
fs.writeFileSync(file, c)
console.log('Patched payload/dist/bin/loadEnv.js')
