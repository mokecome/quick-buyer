"use client"

import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supportedLanguages, type SupportedLanguage } from '@/src/i18n'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: SupportedLanguage) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === i18n.language
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
            className={i18n.language === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.code === 'en' ? '🇺🇸' : '🇨🇳'}</span>
            {lang.nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
