import type { ReactNode } from 'react';

interface SectionProps {
  tone?: 'light' | 'tint' | 'dark';
  children: ReactNode;
  narrow?: boolean;
  id?: string;
}

export default function Section({ tone = 'light', children, narrow = false, id }: SectionProps) {
  return (
    <section id={id} className={`section section-${tone}`}>
      <div className={`inner ${narrow ? 'inner-narrow' : ''}`}>{children}</div>

      <style jsx>{`
        .section {
          padding: 4rem 1.5rem;
          scroll-margin-top: 72px;
        }

        .section-light {
          background: #ffffff;
          color: #0b233f;
        }

        .section-tint {
          background: #f4f6fa;
          color: #0b233f;
        }

        .section-dark {
          background: #0b233f;
          color: #ffffff;
        }

        .inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .inner-narrow {
          max-width: 760px;
        }
      `}</style>
    </section>
  );
}
