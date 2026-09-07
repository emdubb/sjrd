import Hero from '../src/components/Hero';
import Section from '../src/components/Section';
import Button from '../src/components/Button';
import RegistrationForm from '../src/components/RegistrationForm';
import { JOIN_PATHS } from '../src/lib/programContent';
import { DERBY_101_INFO } from '../src/lib/registrationForm';

export default function Join() {
  return (
    <>
      <Hero
        eyebrow="Get Involved"
        title="Join Sacramento Junior Roller Derby"
        description="Here's what to expect when your skater joins the Beastie Bears."
      />

      <Section tone="light">
        <h2 className="section-title center">How to Join</h2>
        <p className="section-body center">
          Not sure where to start? Pick the path that fits your skater.
        </p>
        <div className="paths-grid">
          {JOIN_PATHS.map((path) => (
            <div key={path.tag} className="path-card">
              <p className="path-tag">{path.tag}</p>
              <div className="path-body">
                <h3 className="path-title">{path.title}</h3>
                <p className="path-description">{path.description}</p>
                <div className="path-cta">
                  {path.cta.type === 'button' ? (
                    <Button href={path.cta.href} variant={path.cta.variant}>
                      {path.cta.label}
                    </Button>
                  ) : (
                    <a href={path.cta.href} className="scroll-hint">
                      <span>{path.cta.label}</span>
                      <span className="arrow-down" aria-hidden="true">
                        ↓
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="tint" id="register">
        <h2 className="section-title center">Derby 101 Training Program</h2>
        <p className="section-body center">{DERBY_101_INFO.description}</p>

        <div className="info-grid">
          <div className="info-card">
            <p className="info-label">Cost</p>
            <p className="info-value">{DERBY_101_INFO.cost}</p>
          </div>
          <div className="info-card">
            <p className="info-label">What to Bring</p>
            <ul className="equipment-list">
              {DERBY_101_INFO.equipment.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="equipment-note">{DERBY_101_INFO.equipmentNote}</p>
          </div>
        </div>
      </Section>

      <Section tone="light" id="register">
        <h2 className="section-title center">Register Now</h2>
        <p className="section-body center">
          Fill out the form below to reserve your skater&apos;s spot in our next Derby 101 session.
        </p>
        <RegistrationForm />
      </Section>

      <Section tone="tint" narrow>
        <div className="cta">
          <p className="section-body">Prefer to reach out directly?</p>
          <Button href="mailto:juniorcoaches@sacramentorollerderby.com" variant="secondary">
            Email Us
          </Button>
        </div>
      </Section>

      <style jsx>{`
        .section-title {
          font-size: 1.9rem;
          margin: 0 0 1rem;
        }

        .section-title.center {
          text-align: center;
        }

        .section-body {
          margin: 0 auto;
          max-width: 640px;
          font-size: 1.1rem;
          line-height: 1.8;
        }

        .section-body.center {
          text-align: center;
        }

        .paths-grid {
          margin-top: 2.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .path-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(11, 35, 63, 0.08);
          box-shadow: 0 10px 24px rgba(11, 35, 63, 0.1);
          text-align: left;
        }

        .path-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 2.75rem;
          margin: 0;
          padding: 0.4rem 1rem;
          background: #0b233f;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
          line-height: 1.3;
        }

        .path-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }

        .path-title {
          margin: 0 0 0.75rem;
          font-size: 1.4rem;
        }

        .path-description {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(11, 35, 63, 0.85);
        }

        .path-cta {
          margin-top: auto;
          padding-top: 1.5rem;
        }

        .scroll-hint {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          color: #0b233f;
        }

        .scroll-hint:focus-visible {
          outline: 2px solid #f2bf35;
          outline-offset: 3px;
        }

        .arrow-down {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f2bf35;
          color: #0b233f;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .info-grid {
          margin-top: 2.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .info-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(11, 35, 63, 0.08);
          box-shadow: 0 10px 24px rgba(11, 35, 63, 0.08);
          text-align: left;
        }

        .info-label {
          margin: 0 0 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.875rem;
          font-weight: 700;
          color: rgba(11, 35, 63, 0.65);
        }

        .info-value {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 600;
        }

        .equipment-list {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 1rem;
          line-height: 1.7;
        }

        .equipment-note {
          margin: 1rem 0 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(11, 35, 63, 0.65);
        }

        .cta {
          text-align: center;
        }

        .cta .section-body {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </>
  );
}
