import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PricingClient from './PricingClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: `${t('pricing.title')} | Quick Buyer`,
    description: t('pricing.subtitle'),
  }
}

export default function PricingPage() {
  return <PricingClient />
}
