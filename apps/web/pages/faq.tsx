import Hero from '../src/components/Hero';
import Section from '../src/components/Section';
import FaqAccordion from '../src/components/FaqAccordion';
import { FAQS } from '../src/lib/programContent';

export default function FAQ() {
  return (
    <>
      <Hero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers to the questions parents ask us most. Still have a question? Reach out to juniorcoaches@sacramentorollerderby.com."
      />

      <Section tone="light">
        <FaqAccordion items={FAQS} />
      </Section>
    </>
  );
}
