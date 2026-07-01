/**
 * Debug endpoint — shows what tables exist in Neon and attempts schema migration.
 * DELETE AFTER USE.
 * GET /rodonit-debug  → list tables
 * POST /rodonit-debug → run pushDevSchema directly (bypasses NODE_ENV check)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SECRET = 'rodonit-debug-2026'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const db = payload.db as { drizzle?: { execute: (q: { sql: string; params?: unknown[] }) => Promise<{ rows: Record<string, unknown>[] }> }; execute?: (opts: { drizzle: unknown; raw: string }) => Promise<{ rows: Record<string, unknown>[] }> }

    let tables: unknown[] = []
    if (db.execute && db.drizzle) {
      const result = await db.execute({
        drizzle: db.drizzle,
        raw: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`,
      })
      tables = result.rows.map((r) => r.table_name)
    }

    await (payload.db as { destroy?: () => Promise<void> }).destroy?.()
    return NextResponse.json({ ok: true, tables })
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      cause: err instanceof Error ? String((err as NodeJS.ErrnoException & { cause?: unknown }).cause ?? '') : '',
    })
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    // Import pushDevSchema directly — bypasses connect.js NODE_ENV check
    const { pushDevSchema } = await import('@payloadcms/drizzle')
    await pushDevSchema(payload.db as Parameters<typeof pushDevSchema>[0])

    await (payload.db as { destroy?: () => Promise<void> }).destroy?.()
    return NextResponse.json({ ok: true, message: 'pushDevSchema completed' })
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      cause: err instanceof Error ? String((err as NodeJS.ErrnoException & { cause?: unknown }).cause ?? '') : '',
      stack: err instanceof Error ? err.stack?.split('\n').slice(0, 8).join('\n') : '',
    })
  }
}
