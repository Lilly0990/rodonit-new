@AGENTS.md

# Rodonit Agro — rodonit-new

## Стан на 02.07.2026 — ✅ ВСЕ ГОТОВО
- ✅ Схема Neon мігрована (raw SQL) — всі таблиці
- ✅ Seed повний: settings + 6 продуктів + 4 дистриб'ютори + 7 статей
- ✅ Всі сторінки 200 і тягнуть дані з Payload: /, /preparaty, /distributors, /contacts, /blog
- ✅ Перший адмін: reklama@rodonit.com.ua (пароль тимчасовий, Олег міняє в профілі /admin → Account)
- ✅ /rodonit-debug + /rodonit-seed ВИДАЛЕНО (commit 61b0d40) — безпека
- ✅ SMTP env vars на Vercel (mail.adm.tools:465, reklama@rodonit.com.ua)

## КЛЮЧОВІ УРОКИ (типи id в Payload 3.x Postgres)
- Collection/global tables (products, distributors, settings, articles): `id serial` (integer)
- Non-version array tables (products_cultures, settings_phones): `id varchar` (Payload передає hex)
- Locale tables (products_locales, settings_locales, _products_v_locales!): `id serial` (передає `default`)
  - УВАГА: version locale table = `_products_v_locales` (НЕ `_products_v_version_locales`!)
- Version array tables (_products_v_version_cultures): `id serial PRIMARY KEY` + окрема `_uuid varchar`
- Nested array під localized parent (products_sections_paragraphs): має `_locale varchar(10)`
- exec() в endpoint: drizzle.execute першим (стабільний), НЕ викликати db.destroy() (закриває pool на warm lambda!)
- /rodonit-debug POST з body {sql:[...]} = raw SQL mode (фікси без деплою)

## Наступний крок
- Немає критичних. Опційно: EN-локалізація контенту (Олег заповнює в адмінці), перевірка контакт-форми (реальний тест листа на reklama@).
- Якщо треба знову мігрувати схему — endpoints видалені; підняти тимчасово з git history (commit 47991fb) або через Payload push локально.

## Технічні деталі
- Repo: Lilly0990/rodonit-new → rodonit-new.vercel.app
- Build: `NODE_ENV=development tsx src/scripts/push-schema.ts && next build`
- Postinstall: `node scripts/patch-payload.cjs` (патчить loadEnv.js + pushDevSchema.js)
- Маршрути: /form-submit (контакт-форма), /rodonit-seed (seed!), /rodonit-debug (debug!)
- Всі сторінки: export const dynamic = 'force-dynamic'
- connect.js line 110: `if (process.env.NODE_ENV !== 'production' && ...)` блокує push
- pushDevSchema.js: патч initial:true + acceptWarnings===false (для CI без TTY)

## Env vars на Vercel
- POSTGRES_URL ✅, PAYLOAD_SECRET ✅, NEXT_PUBLIC_SERVER_URL ✅
- SMTP_HOST/PORT/USER/PASS ✅, CONTACT_EMAIL ✅, SEED_SECRET ✅

## SMTP
- host: mail.adm.tools, port: 465, user: reklama@rodonit.com.ua
- Форми летять на reklama → auto-forward → doi@rodonit.com.ua

## Клієнт
- Олег Дубина, Telegram-група "Rodonit dev."
- /admin після seed: email Олега + пароль → create-first-user
