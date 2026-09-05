import PageShell from '../src/components/PageShell';
import TeamCard from '../src/components/TeamCard';
import PathwaySteps from '../src/components/PathwaySteps';
import { TEAMS, PATHWAY_STEPS } from '../src/lib/programContent';

export default function Teams() {
  return (
    <PageShell
      eyebrow="Our Teams"
      title="Teams"
      description="From first strides to competitive play, every Beastie Bear has a team built for where they're at."
    >
      <div className="grid">
        {TEAMS.map((team) => (
          <TeamCard key={team.name} {...team} />
        ))}
      </div>

      <section className="pathway-section">
        <h2 className="section-title">How Skaters Progress</h2>
        <PathwaySteps steps={PATHWAY_STEPS} />
      </section>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .pathway-section {
          margin-top: 4rem;
        }

        .section-title {
          font-size: 1.75rem;
          margin: 0 0 1.5rem;
          color: #0b233f;
        }
      `}</style>
    </PageShell>
  );
}
