import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import BlogClient from './BlogClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: `Blog | Quick Buyer`,
    description: t('blog.metaDescription'),
  }
}

export default function BlogPage() {
  return <BlogClient />
}
