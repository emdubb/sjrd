interface EventCardProps {
  title: string;
  dateLabel: string;
  description: string;
}

export default function EventCard({ title, dateLabel, description }: EventCardProps) {
  return (
    <article className="card">
      <p className="placeholder-flag">Placeholder</p>
      <p className="date">{dateLabel}</p>
      <h3 className="title">{title}</h3>
      <p className="description">{description}</p>

      <style jsx>{`
        .card {
          background: #ffffff;
          color: #0b233f;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: left;
          border: 1px dashed rgba(11, 35, 63, 0.3);
          box-shadow: 0 10px 24px rgba(11, 35, 63, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 32px rgba(11, 35, 63, 0.16);
        }

        .placeholder-flag {
          display: inline-block;
          margin: 0 0 0.75rem;
          padding: 0.2rem 0.6rem;
          background: rgba(11, 35, 63, 0.06);
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(11, 35, 63, 0.65);
        }

        .date {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.875rem;
          font-weight: 700;
          color: #0b233f;
        }

        .title {
          margin: 0.5rem 0;
          font-size: 1.3rem;
        }

        .description {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(11, 35, 63, 0.85);
        }
      `}</style>
    </article>
  );
}
