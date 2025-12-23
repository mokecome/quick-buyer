"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useTranslation } from "react-i18next"
import { HelpCircle } from "lucide-react"

const faqKeys = ['whatGet', 'updates', 'refund', 'payment', 'sell', 'types']

export function FAQ() {
  const { t } = useTranslation()

  return (
    <section id="faq" className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container px-4 md:px-6 max-w-4xl mx-auto relative">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="bg-card/60 backdrop-blur-sm rounded-2xl border shadow-lg p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqKeys.map((key, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b last:border-0 py-2"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:text-primary transition-colors py-4">
                  {t(`faq.items.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                  {t(`faq.items.${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
