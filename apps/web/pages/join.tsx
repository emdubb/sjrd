import PageShell from '../src/components/PageShell';
import Button from '../src/components/Button';
import { JOIN_STEPS } from '../src/lib/programContent';

export default function Join() {
  return (
    <PageShell
      eyebrow="Get Involved"
      title="Join Sacramento Junior Roller Derby"
      description="Here's what to expect when your skater joins the Beastie Bears."
    >
      <ol className="steps">
        {JOIN_STEPS.map((step, index) => (
          <li key={step.title} className="step">
            <span className="step-number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h2 className="step-title">{step.title}</h2>
              <p className="step-body">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="callout">
        <h2 className="callout-title">Volunteer Requirements ("Derby Work")</h2>
        <p className="callout-body">
          Families earn volunteer credit through a sign-up spreadsheet or an individual
          assignment. Volunteering with skaters also requires completing the JRDA Volunteer
          Requirements, which includes a one-time $20 fee. Weekly warehouse cleanup is a separate,
          expected part of membership and does not count toward Derby Work credit.
        </p>
      </section>

      <section className="cta">
        <Button href="mailto:juniorcoaches@sacramentorollerderby.com">
          Contact Us to Get Started
        </Button>
      </section>

      <style jsx>{`
        .steps {
          list-style: none;
          margin: 3rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          text-align: left;
        }

        .step {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }

        .step-number {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f2bf35;
          color: #0b233f;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .step-title {
          margin: 0 0 0.4rem;
          font-size: 1.25rem;
          color: #0b233f;
        }

        .step-body {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(11, 35, 63, 0.85);
        }

        .callout {
          margin-top: 3rem;
          background: #1f3a5b;
          color: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          text-align: left;
        }

        .callout-title {
          margin: 0 0 0.75rem;
          font-size: 1.4rem;
        }

        .callout-body {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: #b9c2cc;
        }

        .cta {
          margin-top: 3rem;
        }
      `}</style>
    </PageShell>
  );
}
