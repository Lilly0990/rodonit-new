/**
 * Runs before next build on Vercel to push Payload schema changes to Neon.
 * Payload's push:true is guarded by NODE_ENV !== 'production', so we
 * temporarily override it here before the build starts.
 */
;(process.env as Record<string, string>)['NODE_ENV'] = 'development'

import { getPayload } from 'payload'
import config from '@payload-config'

void (async () => {
  const payload = await getPayload({ config })
  payload.logger.info('Schema push complete')
  await (payload.db as { destroy?: () => Promise<void> }).destroy?.()
  process.exit(0)
})()
