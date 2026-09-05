import Link from 'next/link';
import { NAV_LINKS } from '../lib/nav';
import { LOCATION } from '../lib/programContent';

const SOCIAL_PLACEHOLDERS = ['IG', 'FB', 'X'];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="inner">
        <div className="brand-block">
          <p className="wordmark">Sacramento Junior Roller Derby</p>
          <p className="tagline">Home of the Beastie Bears</p>
          <p className="address">
            {LOCATION.name} · {LOCATION.address}
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/join">Join</Link>
            </li>
          </ul>
        </nav>

        <div className="contact-block">
          <p className="heading">Contact</p>
          <Link href="mailto:juniorcoaches@sacramentorollerderby.com">
            juniorcoaches@sacramentorollerderby.com
          </Link>
          <div className="socials" aria-label="Social media placeholders">
            {SOCIAL_PLACEHOLDERS.map((label) => (
              <span key={label} className="social-placeholder" title={`${label} placeholder`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="copyright">© {year} Sacramento Junior Roller Derby. All rights reserved.</p>

      <style jsx>{`
        .footer {
          background: #071a30;
          color: #cdd6e0;
          padding: 3.5rem 1.5rem 2rem;
        }

        .inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2.5rem;
        }

        .wordmark {
          margin: 0;
          color: #ffffff;
          font-family: var(--font-display), sans-serif;
          font-size: 1.3rem;
          letter-spacing: 0.02em;
        }

        .tagline {
          margin: 0.5rem 0 0;
          color: #f2bf35;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .address {
          margin: 0.75rem 0 0;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .footer-nav :global(ul) {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .footer-nav :global(a) {
          color: #cdd6e0;
          text-decoration: none;
          font-weight: 600;
        }

        .footer-nav :global(a:hover),
        .footer-nav :global(a:focus-visible) {
          color: #f2bf35;
        }

        .heading {
          margin: 0 0 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
        }

        .contact-block :global(a) {
          color: #cdd6e0;
          font-weight: 600;
        }

        .contact-block :global(a:hover),
        .contact-block :global(a:focus-visible) {
          color: #f2bf35;
        }

        .socials {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }

        .social-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px dashed rgba(205, 214, 224, 0.5);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .copyright {
          max-width: 1100px;
          margin: 3rem auto 0;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(205, 214, 224, 0.15);
          font-size: 0.875rem;
          text-align: center;
        }
      `}</style>
    </footer>
  );
}
