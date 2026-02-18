import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import RefundClient from './RefundClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: `${t('footer.refund')} | Quick Buyer`,
    description: 'Quick Buyer Refund Policy',
  }
}

export default function RefundPage() {
  return <RefundClient />
}
