@AGENTS.md

# Rodonit Agro — rodonit-new

## Стан на 02.07.2026 — ✅ ВСЕ ГОТОВО
- ✅ Схема Neon мігрована (raw SQL) — всі таблиці
- ✅ Seed повний: settings + 6 продуктів + 4 дистриб'ютори + 7 статей
- ✅ Всі сторінки 200 і тягнуть дані з Payload: /, /preparaty, /distributors, /contacts, /blog
- ✅ Перший адмін: reklama@rodonit.com.ua (пароль тимчасовий, Олег міняє в профілі /admin → Account)
- ✅ /rodonit-debug + /rodonit-seed ВИДАЛЕНО (commit 61b0d40) — безпека
- ✅ SMTP env vars на Vercel (mail.adm.tools:465, reklama@rodonit.com.ua)
- ✅ Блог покращено (02.07): 7 обкладинок (Pollinations Flux → public/blog/{slug}.jpg),
  rich-структура статей (заголовки h2 + списки), cover-hero + типографіка.
- ✅ Блок «Три-Е» / 3E ВИДАЛЕНО з головної + /about (commit 4d90e23). Олег у Fathom-розмові
  прямо: «воно нахуй не нужно» — це стара ідея суббренду, неактуальна після Covid/війни.
- ✅ SEO-пакет (02.07): sitemap.xml (20 URL, динамічний), robots.txt (СТАТИЧНИЙ public/robots.txt —
  динамічний robots.ts НЕ генерувався у Next16+route-groups!), Organization+LocalBusiness schema
  (OrganizationSchema.tsx у layout, тягне settings), Product+Breadcrumb schema на препаратах,
  OG-зображення (public/og-image.jpg), оновлені title/description/keywords, адреса в topbar.
- ✅ Обкладинки новин на головній (page.tsx) + на /blog — fallback /blog/{slug}.jpg.

## Звірка з розмовою Олега (Fathom/NotebookLM d5a3d705, перевірено 02.07)
- МОВИ: українська + англійська (обидві потрібні). Олег: «двома мовами, тільки дві, українська,
  англійська... більше ніяких». EN контент ЩЕ НЕ заповнений — треба доробити (структура uk+en готова).
- 3E: НЕ потрібно → видалено ✅.
- Техсхеми/Рішення проблем/Результати — прибрати як окремі розділи → вже видалені ✅.
- Графіка «СІЮ Бережливо» (хвилі/елементи) — Олег обіцяв надіслати у кривих, ще чекаємо.

## Блог — як оновлювати
- Cover: статичний `public/blog/{slug}.jpg` (fallback у рендері; media/Blob НЕ налаштовано).
- Контент статей (paragraphs) у Neon — оновлювати через Payload REST API PATCH з JWT-токеном
  (endpoints видалені; seed/debug більше немає). Скрипт-зразок: scratchpad/rich_update.py.
  PATCH /api/articles/{id}?locale=uk  body {"paragraphs":[{"text","isHeading"}]}.
- Рендер blog/[slug]: renderBlocks() — рядок "• ..." групується в <ul>, isHeading→h2.

## КЛЮЧОВІ УРОКИ (типи id в Payload 3.x Postgres)
- Collection/global tables (products, distributors, settings, articles): `id serial` (integer)
- Non-version array tables (products_cultures, settings_phones): `id varchar` (Payload передає hex)
- Locale tables (products_locales, settings_locales, _products_v_locales!): `id serial` (передає `default`)
  - УВАГА: version locale table = `_products_v_locales` (НЕ `_products_v_version_locales`!)
- Version array tables (_products_v_version_cultures): `id serial PRIMARY KEY` + окрема `_uuid varchar`
- Nested array під localized parent (products_sections_paragraphs): має `_locale varchar(10)`
- exec() в endpoint: drizzle.execute першим (стабільний), НЕ викликати db.destroy() (закриває pool на warm lambda!)
- /rodonit-debug POST з body {sql:[...]} = raw SQL mode (фікси без деплою)

## Виправлено після першого деплою (02.07)
- **Адмінка падала 500** (`Failed query ... payload_locked_documents__rels`): нова колекція distributors
  потребує колонку `distributors_id` у `payload_locked_documents_rels` І `payload_preferences_rels`.
  УВАГА: реальна назва таблиці `payload_locked_documents_rels` (ОДНЕ _), не `__rels` (два)!
  Фікс: `ALTER TABLE ..._rels ADD COLUMN distributors_id integer REFERENCES distributors(id)`.
  → При додаванні БУДЬ-ЯКОЇ нової колекції додавати {collection}_id у ці дві rels-таблиці.
- **Фото Сільвер Мікс 404**: seed НЕ вантажив media (collection порожня). Frontend fallback
  `/products/{slug}.png`. silver-mix не мав файла. Решта продуктів мали правильні файли за slug.
  Фікс: справжнє фото нової упаковки Silver Mix → `Desktop\Проєкти\Rodonit\Silver Mix.png`
  (зелена каністра). УВАГА: zerebra-agro.png — це СТАРА упаковка з написом «Зеребра Агро»,
  НЕ використовувати для silver-mix (плутанина брендів, хоч продукт той самий).

## Наступний крок
- Немає критичних. Опційно: фото у CMS media (зараз static fallback), EN-локалізація, тест контакт-форми.
- Якщо треба знову мігрувати схему — endpoints видалені; підняти з git history (commit 47991fb).

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
