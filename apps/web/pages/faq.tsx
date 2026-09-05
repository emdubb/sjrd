import PageShell from '../src/components/PageShell';
import FaqAccordion from '../src/components/FaqAccordion';
import { FAQS } from '../src/lib/programContent';

export default function FAQ() {
  return (
    <PageShell
      eyebrow="FAQ"
      title="Frequently Asked Questions"
      description="Answers to the questions parents ask us most. Still have a question? Reach out to juniorcoaches@sacramentorollerderby.com."
    >
      <FaqAccordion items={FAQS} />
    </PageShell>
  );
}
