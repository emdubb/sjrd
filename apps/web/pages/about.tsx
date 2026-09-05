import Hero from '../src/components/Hero';
import Section from '../src/components/Section';
import PathwaySteps from '../src/components/PathwaySteps';
import ImagePlaceholder from '../src/components/ImagePlaceholder';
import CoachCard from '../src/components/CoachCard';
import Button from '../src/components/Button';
import { PATHWAY_STEPS, COACHES } from '../src/lib/programContent';

export default function About() {
  return (
    <>
      <Hero
        eyebrow="About Us"
        title="About the Beastie Bears"
        description="The Beastie Bears are the Sacramento Roller Derby junior program. We're an open gender program for skaters ages 8-17 (18 if you turn 17 before the JRDA season begins on September 1), and a proud member of the Junior Roller Derby Association (JRDA)."
      />

      <Section tone="light">
        <ImagePlaceholder label="Skaters on track action photo placeholder" aspectRatio="21 / 9" />
      </Section>

      <Section tone="tint">
        <h2 className="section-title">Our Teams</h2>
        <p className="section-body">
          We have two teams in our Beastie Bears program. <strong>Sabotage</strong> is our
          charter team, competing in sanctioned JRDA games, tournaments, and post-season play.{' '}
          <strong>Intergalactic</strong> is our development team, fostering a fun and competitive
          environment to build the skills skaters need to be ready for higher-level play.
        </p>
      </Section>

      <Section tone="light">
        <h2 className="section-title">Getting Started: Training Program</h2>
        <p className="section-body">
          Our Training Program builds the foundational skills needed to play roller derby and
          serves as the entry feeder into Intergalactic. <strong>Derby 101</strong> is a
          beginner-level program open to all youth and does not require any prior skills — it
          focuses on basic skating skills, safety, and roller derby concepts.{' '}
          <strong>Derby 201</strong> is by invitation only and requires completion of Derby 101.
          It focuses on learning roller derby gameplay and full contact to prepare skaters for
          joining the Intergalactic team.
        </p>
      </Section>

      <Section tone="dark">
        <h2 className="section-title center">The Pathway</h2>
        <p className="section-body center">
          Every skater has a clear path forward, from first strides to competitive play.
        </p>
        <PathwaySteps steps={PATHWAY_STEPS} />
      </Section>

      <Section tone="tint">
        <h2 className="section-title center">Meet Our Coaches</h2>
        <p className="section-body center">
          Our coaches keep every practice safe, fun, and focused on building skaters up.
        </p>
        <div className="grid">
          {COACHES.map((coach) => (
            <CoachCard key={coach.name} {...coach} />
          ))}
        </div>
      </Section>

      <Section tone="light" narrow>
        <div className="cta">
          <Button href="/join">Join Sacramento Junior Roller Derby</Button>
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
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.8;
        }

        .section-body.center {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 2.5rem;
        }

        .cta {
          text-align: center;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
      `}</style>
    </>
  );
}
