import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh', 'ch'],
  defaultLocale: 'zh',
  localePrefix: 'never', // Do not add language prefix to URLs
})
