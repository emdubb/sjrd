import Hero from '../src/components/Hero';
import Section from '../src/components/Section';
import TeamCard from '../src/components/TeamCard';
import PathwaySteps from '../src/components/PathwaySteps';
import { TRAINING_TEAMS, COMPETITIVE_TEAMS, PATHWAY_STEPS } from '../src/lib/programContent';

export default function Teams() {
  return (
    <>
      <Hero
        eyebrow="Our Teams"
        title="Teams"
        description="From first strides to competitive play, every Beastie Bear has a team built for where they're at."
      />

      <Section tone="tint">
        <div className="group">
          <h2 className="group-title">Training Program</h2>
          <div className="grid">
            {TRAINING_TEAMS.map((team) => (
              <TeamCard key={team.name} {...team} />
            ))}
          </div>
        </div>

        <div className="group">
          <h2 className="group-title">Our Teams</h2>
          <div className="grid">
            {COMPETITIVE_TEAMS.map((team) => (
              <TeamCard key={team.name} {...team} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark">
        <h2 className="section-title center">How Skaters Progress</h2>
        <PathwaySteps steps={PATHWAY_STEPS} />
      </Section>

      <style jsx>{`
        .group {
          max-width: 800px;
          margin: 0 auto;
        }

        .group + .group {
          margin-top: 3.5rem;
        }

        .group-title {
          font-size: 1.5rem;
          margin: 0 0 1.5rem;
          text-align: center;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.9rem;
          margin: 0 0 2rem;
        }

        .section-title.center {
          text-align: center;
        }
      `}</style>
    </>
  );
}
