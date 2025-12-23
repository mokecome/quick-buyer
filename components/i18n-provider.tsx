"use client"

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/src/i18n'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true)

    // Apply stored language preference after hydration
    try {
      const storedLang = localStorage.getItem('language')
      if (storedLang && ['en', 'zh', 'ch'].includes(storedLang) && storedLang !== i18n.language) {
        i18n.changeLanguage(storedLang)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
