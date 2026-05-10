import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { PRICING_FAQS } from "./faq-data";

export function PricingFaq() {
  return (
    <section aria-labelledby="faq-heading" className="section">
      <div className="container-page">
        <div className="flex flex-col gap-12 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-1 items-center text-center">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ FAQ
            </Badge>
            <h2 id="faq-heading">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground mx-auto text-base">
              Everything you need to know about Humanly and our pricing plans.
            </p>
          </div>

          {/* Accordion */}
          <Accordion>
            {PRICING_FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed max-w-none">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
