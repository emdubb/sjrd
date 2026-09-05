import Link from 'next/link';
import type { ReactNode } from 'react';

interface ButtonProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
}

export default function Button({ href, variant = 'primary', children }: ButtonProps) {
  return (
    <Link href={href} className={`btn btn-${variant}`}>
      {children}
      <span className="arrow" aria-hidden="true">
        →
      </span>
      <style jsx>{`
        :global(.btn) {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          font-size: 1rem;
          padding: 0.9rem 1.75rem;
          border-radius: 8px;
          border: 2px solid transparent;
          transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
        }

        :global(.btn:hover) {
          transform: translateY(-3px);
        }

        :global(.btn:focus-visible) {
          outline: 2px solid #f2bf35;
          outline-offset: 3px;
        }

        :global(.btn .arrow) {
          transition: transform 0.15s ease;
        }

        :global(.btn:hover .arrow) {
          transform: translateX(3px);
        }

        :global(.btn-primary) {
          background: #f2bf35;
          color: #0b233f;
          box-shadow: 0 8px 18px rgba(242, 191, 53, 0.35);
        }

        :global(.btn-primary:hover),
        :global(.btn-primary:focus-visible) {
          background: #ffcf5c;
        }

        :global(.btn-secondary) {
          background: #ffffff;
          border-color: #0b233f;
          color: #0b233f;
        }

        :global(.btn-secondary:hover),
        :global(.btn-secondary:focus-visible) {
          background: #0b233f;
          color: #ffffff;
        }

        :global(.btn-outline) {
          background: transparent;
          border-color: #ffffff;
          color: #ffffff;
        }

        :global(.btn-outline:hover),
        :global(.btn-outline:focus-visible) {
          background: #ffffff;
          color: #0b233f;
        }
      `}</style>
    </Link>
  );
}
