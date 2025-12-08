import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

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

i18n
  // Detect user language automatically
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'zh', // Default fallback to Chinese
    supportedLngs: ['en', 'zh', 'ch'],

    // Language detection options
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache language selection in localStorage
      caches: ['localStorage'],
      // localStorage key for storing language preference
      lookupLocalStorage: 'language',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense to avoid SSR issues
    },
  })

export default i18n
