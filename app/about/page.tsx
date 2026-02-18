import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import AboutClient from './AboutClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: `About Quick Buyer | Quick Buyer`,
    description: t('features.subtitle'),
  }
}

export default function AboutPage() {
  return <AboutClient />
}
