// Дані препаратів — взяті з реального контенту rodonit.com.ua (scraped 10.06.2026).
// Категоризація за діючою речовиною та призначенням, як описано на сайті виробника.

export type CategorySlug =
  | 'stymulyatory'
  | 'mikrodobryva'
  | 'fungitsydy'
  | 'adyuvanty'
  | 'destruktory'

export interface Category {
  slug: CategorySlug
  name: string
  description: string
}

export interface Product {
  slug: string
  name: string
  category: CategorySlug
  image: string
  shortDescription: string
  activeIngredient?: string
  hazardClass?: string
  purpose?: string
}

export const categories: Category[] = [
  {
    slug: 'stymulyatory',
    name: 'Стимулятори росту',
    description:
      'Біостимулятори, що активують природні процеси рослини: проростання, розвиток кореневої системи, стресостійкість та імунітет.',
  },
  {
    slug: 'mikrodobryva',
    name: 'Мікродобрива',
    description:
      'Препарати для корекції дефіциту макро- і мікроелементів — кальцію, бору, міді, цинку та гумінових речовин.',
  },
  {
    slug: 'fungitsydy',
    name: 'Фунгіциди',
    description:
      'Мідьвмісні препарати для захисту рослин від грибкових і бактеріальних захворювань.',
  },
  {
    slug: 'adyuvanty',
    name: 'Ад’юванти (прилипачі)',
    description:
      'Допоміжні речовини, що покращують змочування, прилипання й утримання робочих розчинів пестицидів та добрив на рослині.',
  },
  {
    slug: 'destruktory',
    name: 'Деструктори стерні',
    description:
      'Біопрепарати для прискореного розкладу рослинних решток і гуміфікації ґрунту після збору врожаю.',
  },
]

export const products: Product[] = [
  {
    slug: 'zerebra-agro',
    name: 'Зеребра АГРО',
    category: 'stymulyatory',
    image: '/products/zerebra-agro.png',
    shortDescription:
      'Єдиний у світі препарат на основі колоїдного срібла. Стимулятор росту з бактерицидним і фунгіцидним ефектом.',
    purpose: 'Стимуляція росту, захист від бактеріальних і грибкових інфекцій',
  },
  {
    slug: 'mira-life-s1',
    name: 'MIRA LIFE S1',
    category: 'stymulyatory',
    image: '/products/mira-life-s1.png',
    shortDescription:
      'Водорозчинний концентрат-біостимулятор для зернових культур. Активує природні механізми захисту рослини.',
    hazardClass: '4 (мало небезпечна речовина)',
  },
  {
    slug: 'mira-life-s2',
    name: 'MIRA LIFE S2',
    category: 'stymulyatory',
    image: '/products/mira-life-s2.png',
    shortDescription:
      'Водорозчинний концентрат-біостимулятор для просапних та овочевих культур. Підвищує стресостійкість і врожайність.',
    hazardClass: '4 (мало небезпечна речовина)',
  },
  {
    slug: 'mira-rk',
    name: 'Міра, РК',
    category: 'stymulyatory',
    image: '/products/mira-rk.png',
    shortDescription:
      'Фульвово-гуміновий стимулятор росту спрямованої дії з антистресовими властивостями.',
    hazardClass: '4 (мало небезпечна речовина)',
  },
  {
    slug: 'verno-sav',
    name: 'Верно СаВ',
    category: 'mikrodobryva',
    image: '/products/verno-sav.jpg',
    shortDescription:
      'Корекція дефіциту кальцію й бору. Запобігає розтріскуванню плодів та фізіологічним розладам рослин.',
    activeIngredient: 'Кальцій (Ca) 16%, бор (B) 9,0%',
    hazardClass: '3',
    purpose: 'Корекція дефіциту кальцію і бору',
  },
  {
    slug: 'verno-fg',
    name: 'Верно FG Cu30 + Zn30',
    category: 'mikrodobryva',
    image: '/products/verno-fg.png',
    shortDescription:
      'Мінеральне добриво для корекції дефіциту міді та цинку з природними ад’ювантами.',
    activeIngredient: 'Мідь (Cu) 300 г/кг + цинк (Zn) 300 г/кг',
    hazardClass: '3',
    purpose: 'Корекція дефіциту міді та цинку',
  },
  {
    slug: 'lignohumat',
    name: 'Лігногумат',
    category: 'mikrodobryva',
    image: '/products/lignohumat.png',
    shortDescription:
      'Гумінове мікродобриво: стимулятор росту, антистресант і прилипач, збагачений амінокислотами, вітамінами та фітогормонами.',
    purpose: 'Живлення, антистрес, структуроутворення ґрунту',
  },
  {
    slug: 'nordoks',
    name: 'НОРДОКС 75 WG',
    category: 'fungitsydy',
    image: '/products/nordoks.png',
    shortDescription:
      'Концентрований мідний фунгіцид і бактерицид. 75% складу — чиста біологічно активна мідь.',
    activeIngredient: 'Оксид міді (Cu₂O) — 860 г/кг (≈750 г/кг міді)',
    hazardClass: '3',
    purpose: 'Захист від грибкових і бактеріальних захворювань',
  },
  {
    slug: 'hydrolip',
    name: 'Гідролип',
    category: 'adyuvanty',
    image: '/products/hydrolip.png',
    shortDescription:
      'Гідрогелевий прилипач. Утворює водо-газопроникну плівку, яка не змивається дощем уже через 30 хвилин після обробки.',
    purpose: 'Підвищення ефективності ЗЗР і позакореневих підживлень',
  },
  {
    slug: 'mira-lyp',
    name: 'Міра ЛИП',
    category: 'adyuvanty',
    image: '/products/mira-lyp.png',
    shortDescription:
      'Гуматизований гідрогель-прилипач для обробки насіння та позакореневих підживлень. Скорочує витрати пестицидів на 15%+.',
    purpose: 'Прилипач для пестицидів, добрив і біопрепаратів',
  },
  {
    slug: 'rizobakt',
    name: 'Ризобакт «Гуміфікатор»',
    category: 'destruktory',
    image: '/products/rizobakt.png',
    shortDescription:
      'Біодеструктор стерні. За 4–6 місяців розкладає 4 т/га і більше соломи без додаткового внесення азоту.',
    purpose: 'Розклад рослинних решток і гуміфікація ґрунту',
  },
]

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug)
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getCategory(slug: CategorySlug): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
