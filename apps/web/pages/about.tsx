import PageShell from '../src/components/PageShell';
import PathwaySteps from '../src/components/PathwaySteps';
import ImagePlaceholder from '../src/components/ImagePlaceholder';
import Button from '../src/components/Button';
import { PATHWAY_STEPS } from '../src/lib/programContent';

export default function About() {
  return (
    <PageShell
      eyebrow="About Us"
      title="About the Beastie Bears"
      description="The Beastie Bears are the Sacramento Roller Derby junior program. We're an open gender program for skaters ages 8-17 (18 if you turn 17 before the JRDA season begins on September 1), and a proud member of the Junior Roller Derby Association (JRDA)."
    >
      <section className="section">
        <ImagePlaceholder label="Skaters on track action photo placeholder" aspectRatio="21 / 9" />
      </section>

      <section className="section">
        <h2 className="section-title">Our Teams</h2>
        <p className="section-body">
          We have two teams in our Beastie Bears program. <strong>Sabotage</strong> is our
          charter team, competing in sanctioned JRDA games, tournaments, and post-season play.{' '}
          <strong>Intergalactic</strong> is our development team, fostering a fun and competitive
          environment to build the skills skaters need to be ready for higher-level play.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">Getting Started: Blast Off Bears</h2>
        <p className="section-body">
          Our Blast Off Bears program builds the foundational skills needed to play roller derby
          and serves as the entry feeder into Intergalactic. <strong>Ursa Minor</strong> is a
          beginner-level program open to all youth and does not require any prior skills — it
          focuses on basic skating skills, safety, and roller derby concepts.{' '}
          <strong>Ursa Major</strong> is by invitation only and requires completion of Ursa Minor.
          It focuses on learning roller derby gameplay and full contact to prepare skaters for
          joining the Intergalactic team.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">The Pathway</h2>
        <p className="section-body">
          Every skater has a clear path forward, from first strides to competitive play.
        </p>
        <PathwaySteps steps={PATHWAY_STEPS} />
      </section>

      <section className="section cta">
        <Button href="/join">Join Sacramento Junior Roller Derby</Button>
      </section>

      <style jsx>{`
        .section {
          margin-top: 3.5rem;
          text-align: left;
        }

        .section-title {
          font-size: 1.75rem;
          margin: 0 0 1rem;
          color: #0b233f;
        }

        .section-body {
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(11, 35, 63, 0.85);
        }

        .cta {
          text-align: center;
        }
      `}</style>
    </PageShell>
  );
}
