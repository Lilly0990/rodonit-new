import { cookies } from 'next/headers'

export type Locale = 'uk' | 'en'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const loc = cookieStore.get('locale')?.value
  return loc === 'en' ? 'en' : 'uk'
}
