import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PrivacyClient from './PrivacyClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: `${t('footer.privacy')} | Quick Buyer`,
    description: 'Quick Buyer Privacy Policy',
  }
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
