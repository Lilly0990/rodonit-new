import type { CategorySlug } from '@/data/products'

// Тематичні SVG-іконки під кожну категорію препаратів
const icons: Record<CategorySlug, React.ReactNode> = {
  // Стимулятори росту — паросток
  stymulyatory: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21v-7m0 0c0-3 2-5 5-5 0 3-2 5-5 5Zm0 0c0-3-2-5-5-5 0 3 2 5 5 5Zm0-5c0-2 1-4 3-5"
    />
  ),
  // Мікродобрива — крапля з елементами
  mikrodobryva: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c3 4 5 6.5 5 9.5a5 5 0 1 1-10 0C7 9.5 9 7 12 3Z"
    />
  ),
  // Фунгіциди — щит захисту
  fungitsydy: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 8.5l2 2 3.5-4"
    />
  ),
  // Ад'юванти — крапля на листку
  adyuvanty: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13c4-1 7-4 9-9 2 5 5 8 5 11a7 7 0 0 1-14 0m2.5-1.5c1.5-.5 3-1.5 4-3"
    />
  ),
}

export default function CategoryIcon({ slug, className = 'w-8 h-8' }: { slug: CategorySlug; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
      {icons[slug]}
    </svg>
  )
}
