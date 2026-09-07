import Hero from '../src/components/Hero';
import Section from '../src/components/Section';
import EventCard from '../src/components/EventCard';
import Button from '../src/components/Button';
import { LOCATION } from '../src/lib/programContent';

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
    <>
      <Hero
        eyebrow="Events"
        title="Events"
        description={`Home games and tournaments are held at ${LOCATION.name}, ${LOCATION.address}.`}
      />

      <Section tone="light">
        <h2 className="section-title">Training Sessions</h2>
        <p className="note">
          New to derby? Our Derby 101 and Derby 201 training sessions are the best place for
          skaters to build foundational skills. Practice schedules are shared with registered
          families.
        </p>
        <div className="cta">
          <Button href="/join">Join a Training Session</Button>
        </div>
      </Section>

      <Section tone="tint">
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
        <div className="cta">
          <Button href="https://www.sacramentorollerderby.com/events" variant="secondary">
            View Full Events Calendar
          </Button>
        </div>
      </Section>

      <style jsx>{`
        .section-title {
          font-size: 1.9rem;
          margin: 0 0 1rem;
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

        .cta {
          margin-top: 2rem;
          text-align: center;
        }
      `}</style>
    </>
  );
}
