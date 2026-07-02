// @ts-nocheck
/**
 * Debug/migrate endpoint. DELETE AFTER USE.
 * GET /rodonit-debug  — list tables + column info
 * POST /rodonit-debug — raw SQL schema migration (no drizzle-kit needed)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SECRET = 'rodonit-debug-2026'

async function exec(db: any, sql: string) {
  const { sql: drizzleSql } = await import('drizzle-orm')
  const raw = drizzleSql.raw(sql)
  // Try every known execution surface; pools may be closed on warm lambdas.
  const drz = db?.drizzle ?? db?.db
  if (drz && typeof drz.execute === 'function') {
    const r = await drz.execute(raw)
    return Array.isArray(r) ? { rows: r } : r
  }
  if (typeof db?.pool?.unsafe === 'function') {
    const rows = await db.pool.unsafe(sql)
    return { rows }
  }
  if (typeof db?.pool?.query === 'function') {
    return db.pool.query(sql)
  }
  throw new Error('no exec surface: db keys = ' + Object.keys(db ?? {}).join(','))
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const payload = await getPayload({ config })
    const db = payload.db as any

    const tablesResult = await exec(db,
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    )
    const tables = tablesResult.rows.map((r: any) => r.table_name)

    const colsResult = await exec(db,
      `SELECT table_name, column_name, data_type
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name IN ('products','articles','settings','articles_paragraphs')
       ORDER BY table_name, ordinal_position`
    )
    const cols: Record<string, string[]> = {}
    for (const r of colsResult.rows) {
      if (!cols[r.table_name]) cols[r.table_name] = []
      cols[r.table_name].push(`${r.column_name}:${r.data_type}`)
    }

    return NextResponse.json({ ok: true, tables, count: tables.length, cols })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err), cause: String(err?.cause ?? '') })
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const payload = await getPayload({ config })
    const db = payload.db as any

    // Raw SQL mode: POST body {sql:"..."} or {sql:["...","..."]} — run ad-hoc without redeploy
    let body: any = null
    try { body = await req.json() } catch {}
    if (body?.sql) {
      const stmts = Array.isArray(body.sql) ? body.sql : [body.sql]
      const out: any[] = []
      for (const s of stmts) {
        try {
          const r = await exec(db, s)
          out.push({ ok: true, sql: s.slice(0, 60), rows: Array.isArray(r) ? r : (r?.rows ?? r) })
        } catch (e: any) {
          out.push({ ok: false, sql: s.slice(0, 60), error: e?.message })
        }
      }
      return NextResponse.json({ ok: true, mode: 'raw', out })
    }

    const log: string[] = []

    const run = async (label: string, sql: string) => {
      try {
        await exec(db, sql)
        log.push(`✅ ${label}`)
      } catch (e: any) {
        log.push(`⚠️  ${label}: ${e?.message?.split('\n')[0]}`)
      }
    }

    // ── DROP array tables (recreate with correct id varchar type) ────────
    // Payload uses id varchar (hex) for array tables, id integer (serial) for collections
    await run('DROP _products_v_version_sections_paragraphs', `DROP TABLE IF EXISTS _products_v_version_sections_paragraphs`)
    await run('DROP _products_v_version_sections',            `DROP TABLE IF EXISTS _products_v_version_sections`)
    await run('DROP _products_v_version_applications',        `DROP TABLE IF EXISTS _products_v_version_applications`)
    await run('DROP _products_v_version_cultures',            `DROP TABLE IF EXISTS _products_v_version_cultures`)
    await run('DROP _products_v_version_locales',             `DROP TABLE IF EXISTS _products_v_version_locales`)
    await run('DROP _distributors_v_version_phones',          `DROP TABLE IF EXISTS _distributors_v_version_phones`)
    await run('DROP distributors_phones',                     `DROP TABLE IF EXISTS distributors_phones`)
    await run('DROP products_sections_paragraphs',            `DROP TABLE IF EXISTS products_sections_paragraphs`)
    await run('DROP products_sections',                       `DROP TABLE IF EXISTS products_sections`)
    await run('DROP products_applications',                   `DROP TABLE IF EXISTS products_applications`)
    await run('DROP products_cultures',                       `DROP TABLE IF EXISTS products_cultures`)
    await run('DROP products_locales',                        `DROP TABLE IF EXISTS products_locales`)
    await run('DROP settings_phones',                         `DROP TABLE IF EXISTS settings_phones`)
    await run('DROP settings_locales',                        `DROP TABLE IF EXISTS settings_locales`)
    await run('DROP articles_locales',                        `DROP TABLE IF EXISTS articles_locales`)
    await run('DROP _articles_v_version_locales',             `DROP TABLE IF EXISTS _articles_v_version_locales`)

    // ── CLEANUP: видалити старі дані (seed перестворить всі) ─────────────
    await run('DELETE articles_paragraphs', `DELETE FROM articles_paragraphs`)
    await run('DELETE _articles_v_version_paragraphs', `DELETE FROM _articles_v_version_paragraphs`)
    await run('DELETE _articles_v', `DELETE FROM _articles_v`)
    await run('DELETE articles', `DELETE FROM articles`)
    await run('DELETE _products_v', `DELETE FROM _products_v`)
    await run('DELETE products', `DELETE FROM products`)

    // ── articles: зробити title/excerpt nullable (тепер в articles_locales) ─
    await run('articles.title DROP NOT NULL',  `ALTER TABLE articles ALTER COLUMN title DROP NOT NULL`)
    await run('articles.excerpt DROP NOT NULL', `ALTER TABLE articles ALTER COLUMN excerpt DROP NOT NULL`)
    await run('_articles_v version_title DROP NOT NULL', `ALTER TABLE _articles_v ALTER COLUMN version_title DROP NOT NULL`)
    await run('_articles_v version_excerpt DROP NOT NULL', `ALTER TABLE _articles_v ALTER COLUMN version_excerpt DROP NOT NULL`)

    // ── products: зробити name nullable (тепер в products_locales) ───────
    await run('products.name DROP NOT NULL', `ALTER TABLE products ALTER COLUMN name DROP NOT NULL`)
    await run('_products_v version_name DROP NOT NULL', `ALTER TABLE _products_v ALTER COLUMN version_name DROP NOT NULL`)

    // ── products: нові не-локалізовані колонки ────────────────────────────
    await run('products.category',       `ALTER TABLE products ADD COLUMN IF NOT EXISTS category varchar`)
    await run('products.main_image_id',  `ALTER TABLE products ADD COLUMN IF NOT EXISTS main_image_id integer REFERENCES media(id)`)
    await run('products.hazard_class',   `ALTER TABLE products ADD COLUMN IF NOT EXISTS hazard_class varchar`)
    await run('products.active',         `ALTER TABLE products ADD COLUMN IF NOT EXISTS active boolean DEFAULT true`)

    // ── products_locales (всі локалізовані поля) ──────────────────────────
    await run('CREATE products_locales', `
      CREATE TABLE IF NOT EXISTS products_locales (
        id serial PRIMARY KEY,
        name varchar,
        short_description varchar,
        subtitle varchar,
        about varchar,
        uniqueness varchar,
        active_ingredient varchar,
        purpose varchar,
        form varchar,
        shelf_life varchar,
        meta_title varchar,
        meta_description varchar,
        _locale varchar(10) NOT NULL,
        _parent_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(_locale, _parent_id)
      )`)

    // ── products_cultures ─────────────────────────────────────────────────
    await run('CREATE products_cultures', `
      CREATE TABLE IF NOT EXISTS products_cultures (
        id varchar PRIMARY KEY,
        name varchar NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE
      )`)

    // ── products_applications ─────────────────────────────────────────────
    await run('CREATE products_applications', `
      CREATE TABLE IF NOT EXISTS products_applications (
        id varchar PRIMARY KEY,
        culture varchar NOT NULL,
        phase varchar NOT NULL,
        rate varchar NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE
      )`)

    // ── products_sections (локалізований масив) ───────────────────────────
    await run('CREATE products_sections', `
      CREATE TABLE IF NOT EXISTS products_sections (
        id varchar PRIMARY KEY,
        heading varchar NOT NULL,
        _order integer NOT NULL,
        _locale varchar(10) NOT NULL,
        _parent_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE
      )`)

    // ── products_sections_paragraphs ──────────────────────────────────────
    await run('CREATE products_sections_paragraphs', `
      CREATE TABLE IF NOT EXISTS products_sections_paragraphs (
        id varchar PRIMARY KEY,
        text varchar NOT NULL,
        _order integer NOT NULL,
        _locale varchar(10),
        _parent_id varchar NOT NULL
      )`)

    // ── _products_v нові колонки ──────────────────────────────────────────
    await run('_products_v.version_category',      `ALTER TABLE _products_v ADD COLUMN IF NOT EXISTS version_category varchar`)
    await run('_products_v.version_main_image_id', `ALTER TABLE _products_v ADD COLUMN IF NOT EXISTS version_main_image_id integer REFERENCES media(id)`)
    await run('_products_v.version_hazard_class',  `ALTER TABLE _products_v ADD COLUMN IF NOT EXISTS version_hazard_class varchar`)
    await run('_products_v.version_active',        `ALTER TABLE _products_v ADD COLUMN IF NOT EXISTS version_active boolean DEFAULT true`)

    // ── _products_v_version_locales ───────────────────────────────────────
    await run('CREATE _products_v_version_locales', `
      CREATE TABLE IF NOT EXISTS _products_v_version_locales (
        id serial PRIMARY KEY,
        version_name varchar,
        version_short_description varchar,
        version_subtitle varchar,
        version_about varchar,
        version_uniqueness varchar,
        version_active_ingredient varchar,
        version_purpose varchar,
        version_form varchar,
        version_shelf_life varchar,
        version_meta_title varchar,
        version_meta_description varchar,
        _locale varchar(10) NOT NULL,
        _parent_id integer NOT NULL REFERENCES _products_v(id) ON DELETE CASCADE,
        UNIQUE(_locale, _parent_id)
      )`)

    // ── _products_v_version_cultures ──────────────────────────────────────
    await run('CREATE _products_v_version_cultures', `
      CREATE TABLE IF NOT EXISTS _products_v_version_cultures (
        id varchar PRIMARY KEY,
        name varchar NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES _products_v(id) ON DELETE CASCADE
      )`)

    // ── _products_v_version_applications ─────────────────────────────────
    await run('CREATE _products_v_version_applications', `
      CREATE TABLE IF NOT EXISTS _products_v_version_applications (
        id varchar PRIMARY KEY,
        culture varchar NOT NULL,
        phase varchar NOT NULL,
        rate varchar NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES _products_v(id) ON DELETE CASCADE
      )`)

    // ── _products_v_version_sections ──────────────────────────────────────
    await run('CREATE _products_v_version_sections', `
      CREATE TABLE IF NOT EXISTS _products_v_version_sections (
        id varchar PRIMARY KEY,
        heading varchar NOT NULL,
        _order integer NOT NULL,
        _locale varchar(10) NOT NULL,
        _parent_id integer NOT NULL REFERENCES _products_v(id) ON DELETE CASCADE
      )`)

    // ── _products_v_version_sections_paragraphs ───────────────────────────
    await run('CREATE _products_v_version_sections_paragraphs', `
      CREATE TABLE IF NOT EXISTS _products_v_version_sections_paragraphs (
        id varchar PRIMARY KEY,
        text varchar NOT NULL,
        _order integer NOT NULL,
        _locale varchar(10),
        _parent_id varchar NOT NULL
      )`)

    // ── distributors (нова колекція) ──────────────────────────────────────
    await run('CREATE distributors', `
      CREATE TABLE IF NOT EXISTS distributors (
        id serial PRIMARY KEY,
        slug varchar UNIQUE NOT NULL,
        company varchar NOT NULL,
        direction varchar NOT NULL,
        direction_label varchar,
        region varchar,
        active boolean DEFAULT true,
        updated_at timestamptz DEFAULT now() NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL
      )`)

    // ── distributors_phones ───────────────────────────────────────────────
    await run('CREATE distributors_phones', `
      CREATE TABLE IF NOT EXISTS distributors_phones (
        id varchar PRIMARY KEY,
        number varchar NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES distributors(id) ON DELETE CASCADE
      )`)

    // ── _distributors_v ───────────────────────────────────────────────────
    await run('CREATE _distributors_v', `
      CREATE TABLE IF NOT EXISTS _distributors_v (
        id serial PRIMARY KEY,
        parent_id integer REFERENCES distributors(id) ON DELETE SET NULL,
        version_slug varchar,
        version_company varchar,
        version_direction varchar,
        version_direction_label varchar,
        version_region varchar,
        version_active boolean DEFAULT true,
        version_updated_at timestamptz DEFAULT now(),
        version_created_at timestamptz DEFAULT now(),
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz DEFAULT now() NOT NULL,
        latest boolean,
        autosave boolean
      )`)

    // ── _distributors_v_version_phones ────────────────────────────────────
    await run('CREATE _distributors_v_version_phones', `
      CREATE TABLE IF NOT EXISTS _distributors_v_version_phones (
        id varchar PRIMARY KEY,
        number varchar NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES _distributors_v(id) ON DELETE CASCADE
      )`)

    // ── articles_locales (title + excerpt тепер локалізовані) ─────────────
    await run('CREATE articles_locales', `
      CREATE TABLE IF NOT EXISTS articles_locales (
        id serial PRIMARY KEY,
        title varchar,
        excerpt varchar,
        _locale varchar(10) NOT NULL,
        _parent_id integer NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        UNIQUE(_locale, _parent_id)
      )`)

    // ── articles_paragraphs: додати _locale ───────────────────────────────
    await run('articles_paragraphs._locale',    `ALTER TABLE articles_paragraphs ADD COLUMN IF NOT EXISTS _locale varchar(10)`)
    await run('articles_paragraphs set locale', `UPDATE articles_paragraphs SET _locale = 'uk' WHERE _locale IS NULL`)

    // ── _articles_v_version_locales ───────────────────────────────────────
    await run('CREATE _articles_v_version_locales', `
      CREATE TABLE IF NOT EXISTS _articles_v_version_locales (
        id serial PRIMARY KEY,
        version_title varchar,
        version_excerpt varchar,
        _locale varchar(10) NOT NULL,
        _parent_id integer NOT NULL REFERENCES _articles_v(id) ON DELETE CASCADE,
        UNIQUE(_locale, _parent_id)
      )`)

    // ── settings: нові колонки ────────────────────────────────────────────
    await run('settings.secretary_phone',               `ALTER TABLE settings ADD COLUMN IF NOT EXISTS secretary_phone varchar`)
    await run('settings.email',                         `ALTER TABLE settings ADD COLUMN IF NOT EXISTS email varchar`)
    await run('settings.address',                       `ALTER TABLE settings ADD COLUMN IF NOT EXISTS address varchar`)
    await run('settings.facebook',                      `ALTER TABLE settings ADD COLUMN IF NOT EXISTS facebook varchar`)
    await run('settings.instagram',                     `ALTER TABLE settings ADD COLUMN IF NOT EXISTS instagram varchar`)
    await run('settings.telegram',                      `ALTER TABLE settings ADD COLUMN IF NOT EXISTS telegram varchar`)
    await run('settings.youtube',                       `ALTER TABLE settings ADD COLUMN IF NOT EXISTS youtube varchar`)
    await run('settings.tiktok',                        `ALTER TABLE settings ADD COLUMN IF NOT EXISTS tiktok varchar`)
    await run('settings.contact_form_email',            `ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_form_email varchar`)
    await run('settings.contact_form_telegram_chat_id', `ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_form_telegram_chat_id varchar`)

    // ── settings_phones ───────────────────────────────────────────────────
    await run('CREATE settings_phones', `
      CREATE TABLE IF NOT EXISTS settings_phones (
        id varchar PRIMARY KEY,
        number varchar NOT NULL,
        label varchar,
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES settings(id) ON DELETE CASCADE
      )`)

    // ── settings_locales (seoDefault — локалізована група) ────────────────
    await run('CREATE settings_locales', `
      CREATE TABLE IF NOT EXISTS settings_locales (
        id serial PRIMARY KEY,
        seo_default_title varchar,
        seo_default_description varchar,
        _locale varchar(10) NOT NULL,
        _parent_id integer NOT NULL REFERENCES settings(id) ON DELETE CASCADE,
        UNIQUE(_locale, _parent_id)
      )`)

    return NextResponse.json({ ok: true, log, total: log.length })
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err?.message ?? String(err),
      cause: String(err?.cause ?? ''),
    })
  }
}
