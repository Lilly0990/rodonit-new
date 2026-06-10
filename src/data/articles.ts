import data from './articles.json'

export interface Article {
  slug: string
  title: string
  category: string
  excerpt: string
  paragraphs: string[]
}

export const articles: Article[] = data as Article[]

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export const latestArticles = articles.slice(0, 3)
