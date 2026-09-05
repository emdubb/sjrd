import { useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '../lib/nav';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-bar">
        <Link href="/" className="brand">
          Sacramento Junior Roller Derby
        </Link>

        <ul className="links links-desktop">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/join" className="join-button">
              Join
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="menu-icon" aria-hidden="true">
            {isMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <ul id="mobile-menu" className="links links-mobile">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/join" className="join-button" onClick={() => setIsMenuOpen(false)}>
              Join
            </Link>
          </li>
        </ul>
      )}

      <style jsx>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #0b233f;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-bar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        :global(.brand) {
          color: #ffffff;
          font-family: var(--font-display), sans-serif;
          font-size: 1.35rem;
          text-decoration: none;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        :global(.brand:hover),
        :global(.brand:focus-visible) {
          color: #f2bf35;
        }

        :global(.brand:focus-visible) {
          outline: 2px solid #f2bf35;
          outline-offset: 4px;
        }

        .links {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }

        .links :global(a) {
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.5rem 0;
        }

        .links :global(a:hover),
        .links :global(a:focus-visible) {
          color: #f2bf35;
        }

        .links :global(a:focus-visible) {
          outline: 2px solid #f2bf35;
          outline-offset: 4px;
        }

        .links :global(.join-button) {
          background: #f2bf35;
          color: #0b233f;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          transition: transform 0.15s ease, background 0.15s ease;
          display: inline-block;
        }

        .links :global(.join-button:hover),
        .links :global(.join-button:focus-visible) {
          color: #0b233f;
          background: #ffcf5c;
          transform: translateY(-2px);
        }

        .menu-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #ffffff;
        }

        .menu-toggle:focus-visible {
          outline: 2px solid #f2bf35;
          outline-offset: 2px;
        }

        .menu-icon {
          font-size: 1.5rem;
          line-height: 1;
        }

        .links-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .links-desktop {
            display: none;
          }

          .menu-toggle {
            display: flex;
          }

          .links-mobile {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            padding: 0.5rem 1.5rem 1.5rem;
            background: #0b233f;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }

          .links-mobile :global(a) {
            display: block;
            padding: 0.85rem 0;
          }

          .links-mobile :global(.join-button) {
            text-align: center;
            margin-top: 0.75rem;
          }
        }
      `}</style>
    </nav>
  );
}
