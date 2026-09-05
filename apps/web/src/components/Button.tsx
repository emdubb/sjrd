import Link from 'next/link';
import type { ReactNode } from 'react';

interface ButtonProps {
  href: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export default function Button({ href, variant = 'primary', children }: ButtonProps) {
  return (
    <Link href={href} className={`btn btn-${variant}`}>
      {children}
      <style jsx>{`
        :global(.btn) {
          display: inline-block;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          font-size: 1rem;
          padding: 0.9rem 1.75rem;
          border-radius: 8px;
          border: 2px solid transparent;
        }

        :global(.btn:focus-visible) {
          outline: 2px solid #f2bf35;
          outline-offset: 3px;
        }

        :global(.btn-primary) {
          background: #f2bf35;
          color: #0b233f;
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
      `}</style>
    </Link>
  );
}
