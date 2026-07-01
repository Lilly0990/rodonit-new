/**
 * Runs before next build on Vercel to push schema changes to Neon.
 * Payload's push:true only works in NODE_ENV !== 'production',
 * so we temporarily override it here.
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
payload.logger.info('Schema push complete')
await (payload.db as { destroy?: () => Promise<void> }).destroy?.()
process.exit(0)
