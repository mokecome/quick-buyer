"use client"

import { useLocale, useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Traditional Chinese', nativeName: '繁體中文' },
  { code: 'ch', name: 'Simplified Chinese', nativeName: '简体中文' },
] as const

type SupportedLanguage = (typeof supportedLanguages)[number]['code']

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  const changeLanguage = (lng: SupportedLanguage) => {
    // Set cookie for server-side locale detection
    document.cookie = `NEXT_LOCALE=${lng}; path=/; max-age=31536000`
    // Also store in localStorage for compatibility
    localStorage.setItem('language', lng)
    // Refresh to let server re-read locale
    router.refresh()
  }

  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === locale
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={locale === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.code === 'en' ? '🇺🇸' : '🇨🇳'}</span>
            {lang.nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
