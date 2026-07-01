/**
 * Runs before next build on Vercel to push Payload schema changes to Neon.
 * Called via: NODE_ENV=development tsx src/scripts/push-schema.ts
 * Dynamic imports ensure NODE_ENV is set before payload.config.ts loads.
 */
async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')

  const payload = await getPayload({ config })
  payload.logger.info('Schema push complete')
  await (payload.db as { destroy?: () => Promise<void> }).destroy?.()
  process.exit(0)
}

main().catch(err => {
  console.error('[push-schema] FAILED:', err)
  process.exit(1)
})
