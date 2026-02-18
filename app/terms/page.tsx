import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import TermsClient from './TermsClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: `${t('footer.terms')} | Quick Buyer`,
    description: 'Quick Buyer Terms of Service',
  }
}

export default function TermsPage() {
  return <TermsClient />
}
