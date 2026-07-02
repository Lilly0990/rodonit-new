@AGENTS.md

# Rodonit Agro — rodonit-new

## Стан на 02.07.2026
- ✅ Схема Neon мігрована через raw SQL (POST /rodonit-debug) — 66/66 таблиць
- ✅ Seed частково: settings + 6 продуктів + 4 дистриб'ютори в БД
- 🔄 Articles (7 шт) — треба створити articles_embeds + _articles_v_version_embeds, потім seed
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

## Наступний крок (після деплою 47991fb)
1. Raw SQL: CREATE articles_embeds + _articles_v_version_embeds
2. POST /rodonit-seed → 7 статей
3. /admin → create-first-user (email Олега + пароль)
4. Видалити /rodonit-debug і /rodonit-seed, задеплоїти
5. Перевірити всі сторінки: /, /preparaty, /distributors, /contacts, /blog

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
