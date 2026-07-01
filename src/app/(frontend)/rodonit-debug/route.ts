// @ts-nocheck
/**
 * Debug/migrate endpoint. DELETE AFTER USE.
 * GET /rodonit-debug  — list tables in Neon
 * POST /rodonit-debug — run pushDevSchema directly (bypasses NODE_ENV check)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { pushDevSchema } from '@payloadcms/drizzle'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SECRET = 'rodonit-debug-2026'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const db = payload.db as any

    const result = await db.execute({
      drizzle: db.drizzle,
      raw: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`,
    })
    const tables = result.rows.map((r: any) => r.table_name)

    await db.destroy?.()
    return NextResponse.json({ ok: true, tables, count: tables.length })
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err?.message ?? String(err),
      cause: String(err?.cause ?? ''),
    })
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    await pushDevSchema(payload.db as any)
    await (payload.db as any).destroy?.()
    return NextResponse.json({ ok: true, message: 'pushDevSchema complete' })
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err?.message ?? String(err),
      cause: String(err?.cause ?? ''),
      stack: err?.stack?.split('\n').slice(0, 8).join('\n'),
    })
  }
}
