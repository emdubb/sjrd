import type { ReactNode } from 'react';

interface PageShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <main className="page">
      <section className="content">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="title">{title}</h1>
        {description && <p className="description">{description}</p>}
        {children}
      </section>

      <style jsx>{`
        .page {
          min-height: calc(100vh - 72px);
          background: #ffffff;
          color: #0b233f;
          padding: 4rem 1.5rem;
        }

        .content {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .eyebrow {
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          color: #0b233f;
          font-weight: 700;
          font-size: 1rem;
          padding-bottom: 0.4rem;
          border-bottom: 3px solid #f2bf35;
        }

        .title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin: 1rem 0;
          line-height: 1.1;
        }

        .description {
          margin: 1.5rem auto 0;
          max-width: 600px;
          color: rgba(11, 35, 63, 0.72);
          font-size: 1.1rem;
          line-height: 1.8;
        }
      `}</style>
    </main>
  );
}
