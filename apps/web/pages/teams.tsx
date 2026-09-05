import Hero from '../src/components/Hero';
import Section from '../src/components/Section';
import TeamCard from '../src/components/TeamCard';
import PathwaySteps from '../src/components/PathwaySteps';
import { TEAMS, PATHWAY_STEPS } from '../src/lib/programContent';

export default function Teams() {
  return (
    <>
      <Hero
        eyebrow="Our Teams"
        title="Teams"
        description="From first strides to competitive play, every Beastie Bear has a team built for where they're at."
      />

      <Section tone="tint">
        <div className="grid">
          {TEAMS.map((team) => (
            <TeamCard key={team.name} {...team} />
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <h2 className="section-title center">How Skaters Progress</h2>
        <PathwaySteps steps={PATHWAY_STEPS} />
      </Section>

      <style jsx>{`
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
