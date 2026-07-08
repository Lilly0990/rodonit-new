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

## Правки Олега (07.07.2026) — власник компанії
- ✅ Topbar (верхня планка): прибрано адресу, лишились тільки телефон + email.
- ✅ Категорія «Ад'юванти» → «Прилипачі» (label скрізь; slug лишився `adyuvanty`).
- ✅ Кнопка/CTA «Зв'язатись з агрономом» → «Зв'язатися з консультантом» (+ текст «наші консультанти»).
- ✅ Соцмережі: додано YouTube + TikTok у Footer (поля в settings є — Олег впише URL в адмінці).
- ✅ Категорія «Біопродукти» ЗАРЕЗЕРВОВАНА: додана в Payload select + CATEGORY_NAMES + типи.
  Таб на /preparaty показується лише для НЕПОРОЖНІХ категорій (ProductFilter.nonEmpty) —
  «Біопродукти» зʼявиться автоматично, коли Олег додасть перший продукт цієї категорії.
- ⏳ Назва розділу «Блог» — Олег питав чи міняти на «Інфотека»/«Публікації». Порада (SEO):
  лишити «Блог» або «Новини та статті» — це пошукові запити; «Інфотека» погана для SEO
  (ніхто так не шукає). Рішення за Олегом, поки НЕ міняли.

## Задачі з дзвінка 08.07 — реалізовано (наші, не блокери)
- ✅ **Динамічна статистика**: settings.statistics (array {value,label}) — Олег редагує в адмінці
  Settings→Статистика. Вивід page.tsx + about.tsx (fallback DEFAULT_STATS у cms.ts).
  Таблиця `settings_statistics` створена через /rodonit-migrate.
- ✅ **Pop-up форма «Замовити»** (`OrderButton.tsx`): у Header, CTA головної, сторінці продукту.
  Поля ім'я+телефон → /form-submit (та сама пошта reklama@). Валідація телефону (10-13 цифр),
  видимий текст (bg-white text-gray-900), label над полями. Перевірено візуально agent-browser.
- ✅ **Інтерактивний регламент**: блок «Застосування на культурах» (`ApplicationsInteractive.tsx`)
  — теги культур клікабельні, під ними регламент (фаза+норма) обраної, дефолт перша.
  Дублює таблицю з акордеону «Детальна інформація» (таблиця ЛИШИЛАСЬ як була).
- ✅ **Фото уніфіковано**: всі 6 → 600x790, продукт 92%, фон прибрано (rembg). scratchpad/standardize.py.
  silver-mix 7MB→205KB.
- ✅ Категорія «Біопродукти» зарезервована; ProductFilter показує лише непорожні таби.
- ✅ **Водяні знаки ВИРІШЕНО 08.07**: Олег надав нові чисті фото (папка Rodonit): nordox.png,
  Verno CaB.png, Verno CuZn.png, ChatGPT Image...(Гідролип), photo_2026-07-08...(Міра РК).
  Замінено 5 фото (окрім silver-mix) через scratchpad/replace_photos.py (rembg+crop+canvas).
- ✅ Таблиця регламенту: прибрано колонку «Фаза розвитку» (містила сміття — назву групи культур,
  не фазу). Тепер Культура + Регламент застосування (rate). break-words, table-fixed.
- ⚠️ **push-schema ПРИБРАНО з build** (package.json): вішав білди на 35хв — drizzle інтерактивний
  промпт enum_products_category (через нову категорію bioprodukty). Міграції ТІЛЬКИ raw SQL
  через /rodonit-migrate. НЕ повертати push-schema в build!
- 🔄 **/rodonit-migrate** endpoint (Bearer rodonit-migrate-2026) — ТИМЧАСОВИЙ, видалити наприкінці.
- 🔄 Ключові слова: файл `Rodonit\Загальні_ключові_слова_для_компанії.docx` (232 рядки, по продуктах:
  брендові/культури/хвороби/перехоплення конкурентів/комерційні). Використати при фінальних текстах:
  сторінки продуктів (title/H1/meta + FAQ під AEO), блог (1 кластер=1 стаття, пріоритет порівняння з
  конкурентами Артемікс/Косайд/Медян). НЕ keyword-stuffing.

## Блокери (чекаємо від Олега/пізніше)
- Текст Hero + «Про компанію» (Олег перепише), ключові слова SEO, тема пробної статті,
  логотипи дистриб'юторів, фото директора, беклінки Biohim/Nordox.
- Форматування блогу (чекаємо тему), SEO під AI (чекаємо контент).
- **Blob** (media→Vercel Blob) — потребує BLOB_READ_WRITE_TOKEN (крок Бро в дашборді).
  Разом з Blob: авто-уніфікація фото при завантаженні (sharp.trim()+resize у Payload upload hook).

## 🔜 НАСТУПНИЙ КРОК (пауза з 08.07) — рішення Бро
ЧЕКАЄМО матеріали від Олега: фінальні тексти (Hero, Про компанію), тема пробної статті,
логотипи дистриб'юторів, фото директора. ПІСЛЯ їх отримання — підключаємо Blob (media→Vercel Blob,
потребує BLOB_READ_WRITE_TOKEN, крок Бро в Vercel дашборді) + авто-уніфікація фото + заливаємо контент.
До того часу — робота на паузі, нових правок не робимо без запиту Бро.

## Довиправлення 08.07 (вечір)
- ✅ Фото Гідролип: rembg зʼїдав білу каністру → flood-fill метод (scratchpad, врахувати для Blob-хука).
- ✅ Прибрано колонку «Фаза розвитку» (сміття: назва групи культур). Фаза внесення вже в тексті rate.
- ✅ Заповнено ВСІ характеристики продуктів з PDF Олога (форма/термін/діюча речовина/призначення).
  Оновлено через raw SQL UPDATE products_locales (PATCH products падав — версійність/drafts баг).
  Джерело: PDF у `Rodonit\контент\ChatExport_2026-06-30\files\_extracted\для сайту\`. Silver Mix — з фото каністри.
- ✅ Соцмережі: YouTube+TikTok у Контактах + усі соцмережі в хедер-topbar (справа).
- ✅ К-сть обробок у регламенті: Verno FG (1-4/1-2 по культурах), Міра (1-6 за вегетацію) — з PDF.
  Nordox — PDF 2-колонковий, к-сть нечітка; Гідролип — у PDF немає к-сті обробок.
- ⚠️ УВАГА: applications/specs оновлені ТІЛЬКИ в БД (raw SQL), НЕ в products.ts. При re-seed зникнуть!
  products.ts застарілий для цих полів — БД є джерелом істини. НЕ робити re-seed products без оновлення products.ts.

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
