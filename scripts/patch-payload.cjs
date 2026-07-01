// Patches Payload/drizzle-kit internals for non-interactive (CI/Vercel) schema push

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

// Patch 3: drizzle-kit/api.js — tablesResolver/columnsResolver show interactive rename prompts
// In CI/Lambda: hanji.render() hangs waiting for stdin keypress → push never completes
// Fix: replace resolvers with auto-create (never rename)
const drizzleApiFile = path.join(__dirname, '..', 'node_modules', 'drizzle-kit', 'api.js')
if (fs.existsSync(drizzleApiFile)) {
  let c = fs.readFileSync(drizzleApiFile, 'utf8')
  if (!c.includes('AUTO-PATCH: always create new tables')) {
    c = c.replace(
      `    tablesResolver = async (input) => {
      try {
        const { created, deleted, moved, renamed } = await promptNamedWithSchemasConflict(
          input.created,
          input.deleted,
          "table"
        );
        return {
          created,
          deleted,
          moved,
          renamed
        };
      } catch (e6) {
        console.error(e6);
        throw e6;
      }
    };`,
      `    tablesResolver = async (input) => {
      // AUTO-PATCH: always create new tables, never rename (CI/non-interactive)
      return { created: input.created, deleted: input.deleted, moved: [], renamed: [] };
    };`
    )
    c = c.replace(
      `    columnsResolver = async (input) => {
      const result = await promptColumnsConflicts(
        input.tableName,
        input.created,
        input.deleted
      );
      return {
        tableName: input.tableName,
        schema: input.schema,
        created: result.created,
        deleted: result.deleted,
        renamed: result.renamed
      };
    };`,
      `    columnsResolver = async (input) => {
      // AUTO-PATCH: always create new columns, never rename (CI/non-interactive)
      return { tableName: input.tableName, schema: input.schema, created: input.created, deleted: input.deleted, renamed: [] };
    };`
    )
    fs.writeFileSync(drizzleApiFile, c)
    console.log('[patch] Fixed drizzle-kit/api.js (tablesResolver/columnsResolver — auto-create)')
  } else {
    console.log('[patch] drizzle-kit/api.js already patched')
  }
}
