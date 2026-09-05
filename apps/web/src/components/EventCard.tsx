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
          background: #1f3a5b;
          color: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: left;
        }

        .placeholder-flag {
          display: inline-block;
          margin: 0 0 0.75rem;
          padding: 0.2rem 0.6rem;
          border: 1px dashed #b9c2cc;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #b9c2cc;
        }

        .date {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.875rem;
          font-weight: 700;
          color: #f2bf35;
        }

        .title {
          margin: 0.5rem 0;
          font-size: 1.3rem;
        }

        .description {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: #b9c2cc;
        }
      `}</style>
    </article>
  );
}
