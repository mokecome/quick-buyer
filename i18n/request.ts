import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { routing } from './routing'

export default getRequestConfig(async () => {
  // proxy.ts sets x-next-intl-locale based on cookie → Accept-Language → default
  const headersList = await headers()
  const locale = headersList.get('x-next-intl-locale') ?? (routing.defaultLocale as string)

  const messages = (await import(`../messages/${locale}.json`)).default

  return { locale, messages }
})
