import PageShell from '../src/components/PageShell';
import Button from '../src/components/Button';
import FactStrip from '../src/components/FactStrip';
import ImagePlaceholder from '../src/components/ImagePlaceholder';
import PathwaySteps from '../src/components/PathwaySteps';
import { QUICK_FACTS, PATHWAY_STEPS } from '../src/lib/programContent';

export default function Home() {
  return (
    <PageShell
      eyebrow="Sacramento Junior Roller Derby"
      title="A place for youth athletes to skate, learn, and lead."
      description="The Beastie Bears are Sacramento Roller Derby's junior program — open gender, ages 8-17, and built on a clear path from first strides to competitive play."
    >
      <div className="cta-row">
        <Button href="/join">Join Now</Button>
        <Button href="/events" variant="secondary">
          See Practice Schedule
        </Button>
      </div>

      <FactStrip facts={QUICK_FACTS} />

      <section className="section">
        <ImagePlaceholder label="Skaters on track action photo placeholder" aspectRatio="21 / 9" />
      </section>

      <section className="section">
        <h2 className="section-title">A Clear Path Forward</h2>
        <p className="section-body">
          Every skater has a place to start and room to grow, from beginner fundamentals to
          sanctioned competitive play.
        </p>
        <PathwaySteps steps={PATHWAY_STEPS} />
        <div className="teams-link">
          <Button href="/teams" variant="secondary">
            Meet Our Teams
          </Button>
        </div>
      </section>

      <style jsx>{`
        .cta-row {
          margin-top: 2.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .section {
          margin-top: 4rem;
          text-align: center;
        }

        .section-title {
          font-size: 1.75rem;
          margin: 0 0 1rem;
          color: #0b233f;
        }

        .section-body {
          margin: 0 auto;
          max-width: 640px;
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(11, 35, 63, 0.85);
        }

        .teams-link {
          margin-top: 2rem;
        }
      `}</style>
    </PageShell>
  );
}
