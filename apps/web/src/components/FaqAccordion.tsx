interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question} className="faq-item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}

      <style jsx>{`
        .faq-list {
          max-width: 720px;
          margin: 2rem auto 0;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .faq-item {
          background: #ffffff;
          border: 1px solid rgba(11, 35, 63, 0.16);
          border-radius: 12px;
          padding: 1rem 1.25rem;
        }

        summary {
          cursor: pointer;
          font-weight: 700;
          font-size: 1.1rem;
          line-height: 1.5;
          color: #0b233f;
          list-style: none;
          padding: 0.75rem 0;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        summary::before {
          content: '+';
          display: inline-block;
          width: 1.25rem;
          color: #f2bf35;
          font-weight: 700;
        }

        .faq-item[open] summary::before {
          content: '−';
        }

        summary:focus-visible {
          outline: 2px solid #f2bf35;
          outline-offset: 3px;
        }

        p {
          margin: 0.75rem 0 0.25rem 1.25rem;
          color: rgba(11, 35, 63, 0.85);
          font-size: 1rem;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
}
