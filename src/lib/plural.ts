/**
 * Українське відмінювання іменників за числом.
 * pluralUk(1, ['препарат','препарати','препаратів']) → 'препарат'
 */
export function pluralUk(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

export function productsCount(n: number): string {
  return `${n} ${pluralUk(n, ['препарат', 'препарати', 'препаратів'])}`
}
