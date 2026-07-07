import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: {
      title: 'Rodonit Agro — Адмінка',
      description: 'Панель управління сайтом Rodonit Agro',
    },
    user: 'users',
  },

  collections: [
    // ─── Користувачі ────────────────────────────────────────────────────────
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [],
      labels: { singular: 'Користувач', plural: 'Користувачі' },
    },

    // ─── Медіафайли ─────────────────────────────────────────────────────────
    {
      slug: 'media',
      upload: {
        staticDir: path.resolve(dirname, '../public/media'),
      },
      admin: { useAsTitle: 'alt' },
      labels: { singular: 'Медіафайл', plural: 'Медіафайли' },
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Alt-опис (SEO)',
          required: false,
          admin: { description: 'Короткий опис зображення для пошукових систем' },
        },
      ],
    },

    // ─── Препарати ──────────────────────────────────────────────────────────
    {
      slug: 'products',
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'category', 'active', '_status'],
        description: 'Препарати Rodonit Agro — основний каталог',
      },
      labels: { singular: 'Препарат', plural: 'Препарати' },
      versions: { drafts: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Назва препарату',
          required: true,
          localized: true,
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug (URL)',
          required: true,
          unique: true,
          admin: { description: 'Латиницею, напр.: silver-mix. Не змінювати після публікації.' },
        },
        {
          name: 'category',
          type: 'select',
          label: 'Категорія',
          required: true,
          options: [
            { label: 'Стимулятори росту', value: 'stymulyatory' },
            { label: 'Мікродобрива', value: 'mikrodobryva' },
            { label: 'Фунгіциди', value: 'fungitsydy' },
            { label: 'Прилипачі', value: 'adyuvanty' },
            { label: 'Біопродукти', value: 'bioprodukty' },
          ],
        },
        {
          name: 'mainImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Фото препарату',
        },
        // ── Короткий опис (картки + SEO) ───────────────────────────────────
        {
          name: 'shortDescription',
          type: 'textarea',
          label: 'Короткий опис (для карток і SEO)',
          localized: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Підзаголовок на сторінці препарату',
          localized: true,
        },
        // ── Характеристики ─────────────────────────────────────────────────
        {
          name: 'about',
          type: 'textarea',
          label: 'Про препарат',
          localized: true,
        },
        {
          name: 'uniqueness',
          type: 'textarea',
          label: 'Унікальність препарату',
          localized: true,
        },
        {
          name: 'activeIngredient',
          type: 'text',
          label: 'Діюча речовина',
          localized: true,
        },
        {
          name: 'purpose',
          type: 'text',
          label: 'Призначення',
          localized: true,
        },
        {
          name: 'hazardClass',
          type: 'text',
          label: 'Клас небезпеки',
        },
        {
          name: 'form',
          type: 'text',
          label: 'Форма випуску, упаковка',
          localized: true,
        },
        {
          name: 'shelfLife',
          type: 'text',
          label: 'Термін придатності',
          localized: true,
        },
        // ── Культури застосування (теги) ───────────────────────────────────
        {
          name: 'cultures',
          type: 'array',
          label: 'Культури застосування',
          admin: { description: 'Теги — для яких культур підходить препарат' },
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Культура',
              required: true,
            },
          ],
        },
        // ── Регламент застосування (таблиця) ──────────────────────────────
        {
          name: 'applications',
          type: 'array',
          label: 'Регламент застосування',
          labels: { singular: 'Рядок таблиці', plural: 'Рядки таблиці' },
          admin: {
            description: 'Норми і фази застосування по культурах — офіційна таблиця',
          },
          fields: [
            {
              name: 'culture',
              type: 'text',
              label: 'Культура',
              required: true,
            },
            {
              name: 'phase',
              type: 'text',
              label: 'Категорія / Фаза',
              required: true,
              admin: { description: 'Напр.: «Польових культурах» або «BBCH 31»' },
            },
            {
              name: 'rate',
              type: 'text',
              label: 'Норма витрати',
              required: true,
            },
          ],
        },
        // ── Детальний опис — акордеон ──────────────────────────────────────
        {
          name: 'sections',
          type: 'array',
          label: 'Розділи детального опису (акордеон)',
          labels: { singular: 'Розділ', plural: 'Розділи' },
          localized: true,
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Заголовок розділу',
              required: true,
            },
            {
              name: 'paragraphs',
              type: 'array',
              label: 'Абзаци',
              fields: [
                {
                  name: 'text',
                  type: 'textarea',
                  label: 'Текст',
                  required: true,
                },
              ],
            },
          ],
        },
        // ── SEO ────────────────────────────────────────────────────────────
        {
          name: 'metaTitle',
          type: 'text',
          label: 'SEO title (якщо відрізняється від назви)',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'SEO description',
          localized: true,
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Активний (показувати на сайті)',
          defaultValue: true,
        },
      ],
    },

    // ─── Дистриб'ютори ──────────────────────────────────────────────────────
    {
      slug: 'distributors',
      admin: {
        useAsTitle: 'company',
        defaultColumns: ['company', 'direction'],
        description: "Офіційні дистриб'ютори Rodonit Agro",
      },
      labels: { singular: "Дистриб'ютор", plural: "Дистриб'ютори" },
      fields: [
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
        },
        {
          name: 'company',
          type: 'text',
          label: 'Назва компанії',
          required: true,
        },
        {
          name: 'direction',
          type: 'select',
          label: 'Напрямок діяльності',
          required: true,
          options: [
            { label: 'Садівництво', value: 'sady' },
            { label: 'Технічні культури', value: 'tehnichni-kultury' },
            { label: 'Овочівництво', value: 'ovochivnytstvo' },
            { label: 'Центральний регіон', value: 'tsentralnyi-region' },
          ],
        },
        {
          name: 'directionLabel',
          type: 'text',
          label: "Підпис ролі (напр. «Офіційний дистриб'ютор по садівництву»)",
        },
        {
          name: 'region',
          type: 'text',
          label: "Адреса / регіон (необов'язково)",
        },
        {
          name: 'phones',
          type: 'array',
          label: 'Телефони',
          fields: [
            {
              name: 'number',
              type: 'text',
              label: 'Номер',
              required: true,
            },
          ],
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Активний (показувати на сайті)',
          defaultValue: true,
        },
      ],
    },

    // ─── Блог / Новини ──────────────────────────────────────────────────────
    {
      slug: 'articles',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'publishedDate', '_status'],
        description: 'Новини компанії та статті для блогу',
      },
      labels: { singular: 'Новина / стаття', plural: 'Новини та статті' },
      access: { read: () => true },
      versions: { drafts: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
          localized: true,
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug (URL)',
          required: true,
          unique: true,
          admin: { description: 'Латиницею, напр.: ahronomichnyi-treninh' },
        },
        {
          name: 'category',
          type: 'select',
          label: 'Рубрика',
          required: true,
          defaultValue: 'Новини',
          options: [
            { label: 'Новини', value: 'Новини' },
            { label: 'Стаття', value: 'Стаття' },
          ],
        },
        {
          name: 'publishedDate',
          type: 'date',
          label: 'Дата публікації',
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Короткий опис (анонс)',
          required: true,
          localized: true,
        },
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Обкладинка',
        },
        {
          name: 'paragraphs',
          type: 'array',
          label: 'Контент статті',
          labels: { singular: 'Блок', plural: 'Блоки' },
          admin: { description: 'Кожен блок — абзац або підзаголовок' },
          localized: true,
          fields: [
            {
              name: 'isHeading',
              type: 'checkbox',
              label: 'Це підзаголовок (H2)',
              defaultValue: false,
            },
            {
              name: 'text',
              type: 'textarea',
              label: 'Текст',
              required: true,
            },
          ],
        },
        // Відео YouTube / TikTok
        {
          name: 'embeds',
          type: 'array',
          label: 'Вбудовані відео (YouTube, TikTok)',
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'URL відео',
              required: true,
              admin: { description: 'Вставте посилання на YouTube або TikTok відео' },
            },
            {
              name: 'caption',
              type: 'text',
              label: "Підпис (необов'язково)",
            },
          ],
        },
      ],
    },

    // ─── Приховані колекції (збережено для майбутнього) ────────────────────
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', '_status'],
        hidden: true,
      },
      labels: { singular: 'Сторінка', plural: 'Сторінки' },
      versions: { drafts: true },
      fields: [
        { name: 'title', type: 'text', label: 'Назва', required: true },
        { name: 'slug', type: 'text', label: 'Slug', required: true, unique: true },
        { name: 'metaTitle', type: 'text', label: 'SEO заголовок' },
        { name: 'metaDescription', type: 'textarea', label: 'SEO опис' },
        { name: 'content', type: 'richText', label: 'Контент', editor: lexicalEditor() },
      ],
    },
  ],

  // ─── Globals ──────────────────────────────────────────────────────────────
  globals: [
    {
      slug: 'settings',
      label: 'Налаштування сайту',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Назва компанії',
          defaultValue: 'Родоніт Агро',
        },
        // ── Контакти ───────────────────────────────────────────────────────
        {
          name: 'phones',
          type: 'array',
          label: 'Телефони головного офісу',
          admin: { description: 'Усі номери — редагуйте без виклику розробника' },
          fields: [
            {
              name: 'number',
              type: 'text',
              label: 'Номер',
              required: true,
              admin: { description: 'Напр.: +38 (044) 502-31-56' },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Підпис (напр. «Відділ продажу»)',
            },
          ],
        },
        {
          name: 'secretaryPhone',
          type: 'text',
          label: 'Приймальна секретаря',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Головний email',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Поштова адреса',
        },
        // ── Соцмережі ──────────────────────────────────────────────────────
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'telegram',
          type: 'text',
          label: 'Telegram (@username або посилання)',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube URL',
        },
        {
          name: 'tiktok',
          type: 'text',
          label: 'TikTok URL',
        },
        // ── Форма зворотного зв'язку ───────────────────────────────────────
        {
          name: 'contactFormEmail',
          type: 'email',
          label: 'Email для заявок з сайту',
          admin: { description: 'Куди надходять заявки з контактної форми' },
        },
        {
          name: 'contactFormTelegramChatId',
          type: 'text',
          label: "Telegram Chat ID для сповіщень (необов'язково)",
          admin: { description: 'Якщо заповнено — заявки дублюються в Telegram' },
        },
        // ── SEO за замовчуванням ───────────────────────────────────────────
        {
          name: 'seoDefault',
          type: 'group',
          label: 'SEO за замовчуванням',
          fields: [
            { name: 'title', type: 'text', label: 'Title', localized: true },
            { name: 'description', type: 'textarea', label: 'Description', localized: true },
          ],
        },
      ],
    },
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'rodonit-dev-secret-change-in-prod',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: (() => {
    const pgUrl =
      process.env.POSTGRES_URL ||
      (process.env.DATABASE_URL?.startsWith('postgres') ? process.env.DATABASE_URL : undefined)
    return pgUrl
      ? postgresAdapter({ pool: { connectionString: pgUrl }, push: true })
      : sqliteAdapter({
          client: { url: process.env.DATABASE_URL || 'file:./rodonit.db' },
          push: true,
        })
  })(),

  sharp,

  localization: {
    locales: [
      { label: 'Українська', code: 'uk' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'uk',
    fallback: true,
  },
})
