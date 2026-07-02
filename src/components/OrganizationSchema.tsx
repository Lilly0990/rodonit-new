import { getSettings } from '@/lib/cms'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rodonit-new.vercel.app'

/**
 * JSON-LD Organization + LocalBusiness для головного макета.
 * Дані тягнуться з Payload settings, тож консистентні з сайтом.
 */
export default async function OrganizationSchema() {
  let settings: Awaited<ReturnType<typeof getSettings>> | null = null
  try {
    settings = await getSettings()
  } catch {
    settings = null
  }

  const phones = (settings?.phones ?? []).map((p) => p.number).filter(Boolean)
  const sameAs = [
    settings?.facebook,
    settings?.instagram,
    settings?.youtube,
    settings?.telegram,
    settings?.tiktok,
  ].filter(Boolean) as string[]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'ТОВ «Родоніт Агро»',
    alternateName: 'Rodonit Agro',
    url: SITE,
    logo: `${SITE}/logo.png`,
    description:
      'Українська компанія — виробник і постачальник препаратів для захисту та живлення рослин: мідні фунгіциди, мікродобрива, стимулятори росту, ад’юванти.',
    ...(settings?.email ? { email: settings.email } : {}),
    ...(phones.length ? { telephone: phones[0] } : {}),
    ...(settings?.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.address,
            addressCountry: 'UA',
          },
        }
      : {}),
    ...(phones.length
      ? {
          contactPoint: phones.map((tel) => ({
            '@type': 'ContactPoint',
            telephone: tel,
            contactType: 'sales',
            areaServed: 'UA',
            availableLanguage: ['uk', 'en'],
          })),
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
