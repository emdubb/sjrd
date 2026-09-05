import type { ReactNode } from 'react';

interface HeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: 'large' | 'compact';
}

export default function Hero({ eyebrow, title, description, children, size = 'compact' }: HeroProps) {
  return (
    <header className={`hero hero-${size}`}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow-pill">{eyebrow}</p>
        <h1 className="hero-title">{title}</h1>
        {description && <p className="hero-description">{description}</p>}
        {children}
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          overflow: hidden;
          color: #ffffff;
          text-align: center;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 15% 20%, #15335a 0%, #0b233f 55%),
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.035) 0px,
              rgba(255, 255, 255, 0.035) 2px,
              transparent 2px,
              transparent 26px
            );
          clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 5rem;
        }

        .hero-large .hero-content {
          padding: 5rem 1.5rem 7rem;
        }

        .eyebrow-pill {
          display: inline-block;
          margin: 0 0 1.25rem;
          padding: 0.5rem 1.1rem;
          background: #f2bf35;
          color: #0b233f;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 700;
          font-size: 0.875rem;
          transform: rotate(-2deg);
        }

        .hero-title {
          margin: 0;
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          line-height: 1.08;
        }

        .hero-large .hero-title {
          font-size: clamp(2.75rem, 6vw, 4.75rem);
        }

        .hero-description {
          margin: 1.5rem auto 0;
          max-width: 620px;
          color: #cdd6e0;
          font-size: 1.15rem;
          line-height: 1.75;
        }
      `}</style>
    </header>
  );
}
