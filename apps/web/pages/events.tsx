import PageShell from '../src/components/PageShell';
import ScheduleTable from '../src/components/ScheduleTable';
import EventCard from '../src/components/EventCard';
import { PRACTICE_SCHEDULE, LOCATION } from '../src/lib/programContent';

const PLACEHOLDER_EVENTS = [
  {
    title: 'Home Bout',
    dateLabel: 'Date TBA',
    description: 'Placeholder for a home game at The BearHouse. Real dates are announced each season.',
  },
  {
    title: 'Regional Tournament',
    dateLabel: 'Date TBA',
    description: 'Placeholder for a JRDA sanctioned tournament. Real dates are announced each season.',
  },
  {
    title: 'Scrimmage Night',
    dateLabel: 'Date TBA',
    description: 'Placeholder for a scrimmage between our teams. Real dates are announced each season.',
  },
];

export default function Events() {
  return (
    <PageShell
      eyebrow="Practices & Events"
      title="Events"
      description={`Practices and home games are held at ${LOCATION.name}, ${LOCATION.address}.`}
    >
      <section className="section">
        <ScheduleTable rows={PRACTICE_SCHEDULE} />
        <p className="note">
          Skaters should arrive with enough time to warm up off skates and get geared up before
          their scheduled start time. Our facility has two tracks — please stay off the other
          team's track during their practice session.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">Upcoming Games & Tournaments</h2>
        <p className="note">
          Registered families get full calendar access after joining. The cards below show how
          upcoming games and tournaments will appear once dates are announced.
        </p>
        <div className="grid">
          {PLACEHOLDER_EVENTS.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>
      </section>

      <style jsx>{`
        .section {
          margin-top: 3rem;
          text-align: left;
        }

        .section-title {
          font-size: 1.75rem;
          margin: 0 0 1rem;
          color: #0b233f;
          text-align: center;
        }

        .note {
          max-width: 640px;
          margin: 1.5rem auto 0;
          text-align: center;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(11, 35, 63, 0.75);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
      `}</style>
    </PageShell>
  );
}
