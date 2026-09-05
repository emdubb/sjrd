import Hero from '../src/components/Hero';
import Section from '../src/components/Section';
import Button from '../src/components/Button';
import FactStrip from '../src/components/FactStrip';
import ImagePlaceholder from '../src/components/ImagePlaceholder';
import PathwaySteps from '../src/components/PathwaySteps';
import TestimonialPlaceholder from '../src/components/TestimonialPlaceholder';
import { QUICK_FACTS, PATHWAY_STEPS } from '../src/lib/programContent';

const WHY_US = [
  'Open gender program — every kid gets a spot on skates',
  'A clear path from first practice to sanctioned competitive play',
  'Coached practices with on-site medics for every session',
  'A family-style team culture, on and off the track',
];

export default function Home() {
  return (
    <>
      <Hero
        size="large"
        eyebrow="Sacramento Junior Roller Derby"
        title="A place for youth athletes to skate, learn, and lead."
        description="The Beastie Bears are Sacramento Roller Derby's junior program — open gender, ages 8-17, and built on a clear path from first strides to competitive play."
      >
        <div className="cta-row">
          <Button href="/join">Join Now</Button>
          <Button href="/events" variant="outline">
            See Practice Schedule
          </Button>
        </div>
      </Hero>

      <Section tone="light">
        <FactStrip facts={QUICK_FACTS} />
        <div className="hero-image">
          <ImagePlaceholder label="Skaters on track action photo placeholder" aspectRatio="21 / 9" />
        </div>
      </Section>

      <Section tone="tint">
        <h2 className="section-title center">A Clear Path Forward</h2>
        <p className="section-body center">
          Every skater has a place to start and room to grow, from beginner fundamentals to
          sanctioned competitive play.
        </p>
        <PathwaySteps steps={PATHWAY_STEPS} />
        <div className="center cta-spacing">
          <Button href="/teams" variant="secondary">
            Meet Our Teams
          </Button>
        </div>
      </Section>

      <Section tone="dark">
        <div className="why-grid">
          <div>
            <h2 className="section-title">Why Families Choose the Beastie Bears</h2>
            <ul className="why-list">
              {WHY_US.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <TestimonialPlaceholder />
        </div>
      </Section>

      <Section tone="light" narrow>
        <div className="closing-cta">
          <h2 className="section-title">Ready to Join the Pack?</h2>
          <p className="section-body">
            Reach out today and we'll help your skater find their spot on the team.
          </p>
          <Button href="/join">Get Started</Button>
        </div>
      </Section>

      <style jsx>{`
        .cta-row {
          margin-top: 2.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .hero-image {
          margin-top: 3rem;
        }

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
          margin-bottom: 2.5rem;
        }

        .cta-spacing {
          margin-top: 2.5rem;
        }

        .center {
          text-align: center;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          align-items: center;
        }

        .why-list {
          margin: 1.5rem 0 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 1.1rem;
        }

        .why-list li {
          padding-left: 1.75rem;
          position: relative;
        }

        .why-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #f2bf35;
          font-weight: 700;
        }

        .closing-cta {
          text-align: center;
        }

        .closing-cta .section-body {
          margin-bottom: 2rem;
        }
      `}</style>
    </>
  );
}
