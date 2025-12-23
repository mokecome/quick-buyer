import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslation from '@/src/locales/en/translation.json'
import zhTranslation from '@/src/locales/zh/translation.json'
import chTranslation from '@/src/locales/ch/translation.json'

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Traditional Chinese', nativeName: '繁體中文' },
  { code: 'ch', name: 'Simplified Chinese', nativeName: '简体中文' },
] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]['code']

// Language resources
const resources = {
  en: { translation: enTranslation },
  zh: { translation: zhTranslation },
  ch: { translation: chTranslation },
}

// Default language - ALWAYS use 'zh' for initial render to avoid hydration mismatch
const DEFAULT_LANGUAGE = 'zh'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE, // Always start with default language
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['en', 'zh', 'ch'],

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n
