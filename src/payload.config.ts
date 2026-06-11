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
      title: 'Rodonit Agro',
      description: 'Панель управління сайтом Rodonit Agro',
    },
    user: 'users',
  },

  collections: [
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [],
      labels: { singular: 'Користувач', plural: 'Користувачі' },
    },

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

    {
      slug: 'products',
      admin: { useAsTitle: 'name', defaultColumns: ['name', 'active', '_status'] },
      labels: { singular: 'Препарат', plural: 'Препарати' },
      versions: { drafts: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Назва препарату',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug (URL)',
          required: true,
          unique: true,
          admin: { description: 'Наприклад: zerebra-agro' },
        },
        {
          name: 'shortDescription',
          type: 'textarea',
          label: 'Короткий опис (для карток)',
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Детальний опис',
          editor: lexicalEditor(),
        },
        {
          name: 'mainImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Головне зображення',
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Активний',
          defaultValue: true,
        },
      ],
    },

    {
      slug: 'cultures',
      admin: { useAsTitle: 'name', defaultColumns: ['name', '_status'] },
      labels: { singular: 'Культура (техносхема)', plural: 'Культури (техносхеми)' },
      versions: { drafts: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Назва культури',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Опис і схеми',
          editor: lexicalEditor(),
        },
        {
          name: 'diagramImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Зображення технологічної схеми',
        },
      ],
    },

    {
      slug: 'problems',
      admin: { useAsTitle: 'name', defaultColumns: ['name', '_status'] },
      labels: { singular: 'Проблема', plural: 'Проблеми і рішення' },
      versions: { drafts: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Назва проблеми',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Контент',
          editor: lexicalEditor(),
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Зображення',
        },
      ],
    },

    {
      slug: 'results',
      admin: { useAsTitle: 'title', defaultColumns: ['title', '_status'] },
      labels: { singular: 'Результат', plural: 'Результати застосування' },
      versions: { drafts: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Назва',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
        },
        {
          name: 'culture',
          type: 'text',
          label: 'Культура',
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Контент',
          editor: lexicalEditor(),
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Зображення',
        },
      ],
    },

    {
      slug: 'pages',
      admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'] },
      labels: { singular: 'Сторінка', plural: 'Сторінки' },
      versions: { drafts: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Назва',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
        },
        {
          name: 'metaTitle',
          type: 'text',
          label: 'SEO заголовок',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'SEO опис',
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Контент',
          editor: lexicalEditor(),
        },
      ],
    },

    {
      slug: 'articles',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'publishedDate', '_status'],
        description: 'Новини компанії та статті для блогу',
      },
      labels: { singular: 'Новина / стаття', plural: 'Новини та статті' },
      access: { read: () => true }, // публічний контент блогу
      versions: { drafts: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
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
      ],
    },
  ],

  globals: [
    {
      slug: 'settings',
      label: 'Налаштування сайту',
      fields: [
        { name: 'siteName', type: 'text', label: 'Назва сайту', defaultValue: 'Rodonit Agro' },
        { name: 'phone', type: 'text', label: 'Телефон' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'address', type: 'textarea', label: 'Адреса' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        {
          name: 'seoDefault',
          type: 'group',
          label: 'SEO за замовчуванням',
          fields: [
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'description', type: 'textarea', label: 'Description' },
          ],
        },
      ],
    },
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'rodonit-secret',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // На Vercel (є POSTGRES_URL від Neon) — Postgres; локально — SQLite-файл.
  db: process.env.POSTGRES_URL
    ? postgresAdapter({
        pool: { connectionString: process.env.POSTGRES_URL },
        push: true,
      })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URL || 'file:./rodonit.db' },
        push: true,
      }),

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
