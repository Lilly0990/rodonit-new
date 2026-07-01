// Дистриб'ютори Rodonit Agro — контент від Олега, Telegram-група 29-30.06.2026

export type DirectionSlug = 'sady' | 'tehnichni-kultury' | 'ovochivnytstvo' | 'tsentralnyi-region'

export interface Direction {
  slug: DirectionSlug
  name: string
}

export interface Distributor {
  slug: string
  company: string
  direction: DirectionSlug
  directionLabel: string
  region?: string
  phones: string[]
}

export const directions: Direction[] = [
  { slug: 'sady', name: 'Садівництво' },
  { slug: 'tehnichni-kultury', name: 'Технічні культури' },
  { slug: 'ovochivnytstvo', name: 'Овочівництво' },
  { slug: 'tsentralnyi-region', name: 'Центральний регіон' },
]

export const distributors: Distributor[] = [
  {
    slug: 'biochem-agro',
    company: 'Biochem Agro',
    direction: 'sady',
    directionLabel: 'Офіційний дистриб’ютор Нордокс по садівництву',
    region: 'Вінницька обл., Вінницький р-н, с. Зарванці, вул. Соснова 17, офіс 208',
    phones: ['+38 (096) 717-47-55'],
  },
  {
    slug: 'agro-mriya',
    company: 'Агро Мрія',
    direction: 'tsentralnyi-region',
    directionLabel: 'Офіційний дистриб’ютор центрального регіону',
    phones: ['+38 (073) 400-04-10'],
  },
  {
    slug: 'balans-agro',
    company: 'Баланс Агро',
    direction: 'tehnichni-kultury',
    directionLabel: 'Офіційний дистриб’ютор технічних культур',
    phones: ['+38 (067) 235-91-01', '+38 (068) 100-10-90'],
  },
  {
    slug: 'nk-rekord',
    company: 'НК Рекорд',
    direction: 'ovochivnytstvo',
    directionLabel: 'Офіційний дистриб’ютор овочівництва',
    phones: ['+380 (93) 244-59-96'],
  },
]
