import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import zhTW from '@/locales/zh-TW.json'

export const defaultNS = 'translation'
export const resources = {
  en: { translation: en },
  'zh-TW': { translation: zhTW },
} as const

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文' },
] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]['code']

// Get initial language from localStorage or browser
function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'zh-TW'

  // Check localStorage first
  const stored = localStorage.getItem('language')
  if (stored && (stored === 'en' || stored === 'zh-TW')) {
    return stored as SupportedLanguage
  }

  // Check browser language
  const browserLang = navigator.language
  if (browserLang.startsWith('zh')) {
    return 'zh-TW'
  }

  return 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: typeof window !== 'undefined' ? getInitialLanguage() : 'zh-TW',
  fallbackLng: 'zh-TW',
  defaultNS,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense to avoid SSR issues
  },
})

export default i18n
