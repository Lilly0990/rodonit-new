import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OrderButton from '@/components/OrderButton'
import { getArticleBySlug } from '@/lib/cms'
import VideoEmbed from '@/components/VideoEmbed'
import { JSX } from 'react'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const TOMATO = '#c63d2f'

export const dynamic = 'force-dynamic'

type Block = { text: string; isHeading?: boolean | null }

// Розбір блоків у стильні елементи:
// isHeading → h2; "• " → checkmark-список; "Питання? — Відповідь" → FAQ-акордеон;
// "Важливий нюанс: …" → томатний callout; фінальний CTA-абзац пропускається (рендер окремо).
function renderBlocks(blocks: Block[]): JSX.Element[] {
  const out: JSX.Element[] = []
  let list: string[] = []

  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="my-6 space-y-3">
          {list.map((t, j) => (
            <li key={j} className="flex gap-3 leading-relaxed">
              <span className="mt-[0.45rem] shrink-0 w-2 h-2 rounded-sm rotate-45 bg-[var(--green)]" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>,
      )
      list = []
    }
  }

  let firstPara = true
  for (const b of blocks) {
    const text = (b.text ?? '').trim()
    if (!text) continue

    // список
    if (!b.isHeading && text.startsWith('• ')) {
      list.push(text.slice(2))
      continue
    }
    flush()

    // фінальний CTA — рендеримо окремим блоком нижче
    if (!b.isHeading && text.startsWith('Потрібна консультація')) continue

    // підзаголовок
    if (b.isHeading) {
      out.push(
        <h2 key={`h-${out.length}`} className="text-2xl md:text-[1.7rem] font-bold text-[var(--green-deep)] mt-12 mb-4 leading-snug scroll-mt-24">
          {text}
        </h2>,
      )
      continue
    }

    // callout «Важливий нюанс»
    if (text.startsWith('Важливий нюанс')) {
      const body = text.replace(/^Важливий нюанс[:\s—-]*/i, '')
      out.push(
        <div key={`c-${out.length}`} className="my-8 rounded-r-xl border-l-4 p-5" style={{ borderColor: TOMATO, background: `${TOMATO}0d` }}>
          <p className="font-semibold mb-1" style={{ color: '#a3301f' }}>Важливий нюанс</p>
          <p className="text-gray-700 leading-relaxed m-0">{body}</p>
        </div>,
      )
      continue
    }

    // FAQ: «Питання? — Відповідь» → акордеон
    const faq = text.match(/^(.+?\?)\s+—\s+([\s\S]+)$/)
    if (faq) {
      out.push(
        <details key={`f-${out.length}`} className="group my-2.5 rounded-lg border border-gray-200 bg-white px-5 open:shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-gray-900 marker:hidden">
            {faq[1]}
            <span className="shrink-0 text-2xl leading-none transition-transform group-open:rotate-45" style={{ color: TOMATO }}>+</span>
          </summary>
          <p className="pb-4 text-gray-600 leading-relaxed m-0">{faq[2]}</p>
        </details>,
      )
      continue
    }

    // звичайний абзац (перший — з буквицею)
    out.push(
      <p
        key={`p-${out.length}`}
        className={
          firstPara
            ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-[var(--green)]'
            : ''
        }
      >
        {text}
      </p>,
    )
    firstPara = false
  }
  flush()
  return out
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Статтю не знайдено' }
  const url = `${SITE}/blog/${article.slug}`
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: article.title, description: article.excerpt, url },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const url = `${SITE}/blog/${article.slug}`
  const dateLabel = article.publishedDate
    ? new Date(article.publishedDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': article.category === 'Новини' ? 'NewsArticle' : 'Article',
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    inLanguage: 'uk-UA',
    ...(article.publishedDate ? { datePublished: article.publishedDate } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Родоніт Агро' },
    publisher: {
      '@type': 'Organization',
      name: 'ТОВ «Родоніт Агро»',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <header className="relative overflow-hidden bg-[var(--green-deep)] text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{ background: `radial-gradient(120% 90% at 90% -10%, ${TOMATO}33, transparent 55%)` }}
            aria-hidden
          />
          <div className="relative max-w-3xl mx-auto px-4 pt-8 pb-28 md:pb-32">
            <nav aria-label="Хлібні крихти" className="mb-6 flex flex-wrap gap-2 text-sm text-green-100/70">
              <Link href="/" className="hover:text-white">Головна</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white">Блог</Link>
            </nav>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
              style={{ background: TOMATO }}
            >
              {article.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl lg:text-[2.85rem] text-balance">
              {article.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-green-100/85">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/15 pt-4 text-sm text-green-100/70">
              <span className="font-semibold text-white">Родоніт Агро</span>
              {dateLabel && (<><span className="opacity-50">•</span><span>{dateLabel}</span></>)}
            </div>
          </div>
        </header>

        {/* ── COVER (заходить на hero) ─────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative -mt-20 md:-mt-24 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-green-50 shadow-xl ring-1 ring-black/5">
            <Image
              src={article.coverImage?.url ?? `/blog/${article.slug}.jpg`}
              alt={article.coverImage?.alt ?? article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── BODY ─────────────────────────────────────────────── */}
        <article className="max-w-3xl mx-auto px-4 pb-8 pt-10">
          <div className="space-y-5 text-[17px] leading-[1.8] text-gray-700">
            {renderBlocks(article.paragraphs)}
          </div>

          {(article.embeds ?? []).length > 0 && (
            <div className="mt-8">
              {(article.embeds ?? []).map((embed, i) => (
                <VideoEmbed key={i} url={embed.url} caption={embed.caption} />
              ))}
            </div>
          )}

          {/* ── CTA ────────────────────────────────────────────── */}
          <div className="relative mt-14 overflow-hidden rounded-2xl bg-[var(--green-deep)] p-8 text-white md:p-10">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(80% 120% at 100% 0%, ${TOMATO}40, transparent 55%)` }}
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-2xl font-bold md:text-[1.7rem]">Залишились питання по застосуванню?</h2>
              <p className="mt-3 max-w-xl text-green-100/85">
                Фахівці «Родоніт Агро» підкажуть схему підживлення під вашу культуру й умови. Напишіть — і ми звʼяжемося з вами.
              </p>
              <div className="mt-6">
                <OrderButton
                  label="Замовити консультацію"
                  className="cursor-pointer rounded-full bg-[#c63d2f] px-6 py-3 font-semibold text-white transition hover:brightness-110"
                />
              </div>
            </div>
          </div>

          <footer className="mt-10 border-t border-gray-200 pt-6">
            <Link href="/blog" className="font-medium text-green-700 hover:underline">← Усі статті</Link>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  )
}
