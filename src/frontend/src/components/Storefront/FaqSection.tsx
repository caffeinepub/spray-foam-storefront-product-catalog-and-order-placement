import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqSection() {
  const faqs = [
    {
      question: 'What is spray foam insulation?',
      answer: 'Spray foam insulation is a high-performance insulation material that expands to fill gaps and create an airtight seal. It provides superior thermal resistance and helps reduce energy costs significantly.',
    },
    {
      question: 'How much does spray foam insulation cost?',
      answer: 'The cost varies depending on the size of your project, type of foam, and accessibility. We offer free estimates to provide you with an accurate quote tailored to your specific needs.',
    },
    {
      question: 'What areas do you serve?',
      answer: 'We proudly serve all of Manitoba and Northwestern Ontario, including Winnipeg, Brandon, Thunder Bay, and surrounding communities.',
    },
    {
      question: 'How long does installation take?',
      answer: 'Most residential projects can be completed in 1-2 days, depending on the size and complexity. We work efficiently to minimize disruption to your daily routine.',
    },
    {
      question: 'Is spray foam insulation safe?',
      answer: 'Yes, once properly cured, spray foam insulation is completely safe. We use high-quality materials and follow all safety protocols during installation.',
    },
    {
      question: 'Do you offer warranties?',
      answer: 'Absolutely! We stand behind our work with comprehensive warranties on both materials and workmanship. Specific warranty details will be provided with your quote.',
    },
  ];

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
