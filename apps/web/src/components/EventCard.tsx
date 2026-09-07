interface EventCardProps {
  title: string;
  dateLabel: string;
  description: string;
}

export default function EventCard({ title, dateLabel, description }: EventCardProps) {
  return (
    <article className="card">
      <p className="tag">Placeholder</p>
      <div className="card-body">
        <p className="date">{dateLabel}</p>
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
      </div>

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ffffff;
          color: #0b233f;
          border-radius: 16px;
          overflow: hidden;
          text-align: left;
          border: 1px dashed rgba(11, 35, 63, 0.3);
          box-shadow: 0 10px 24px rgba(11, 35, 63, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 32px rgba(11, 35, 63, 0.16);
        }

        .tag {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 2.75rem;
          margin: 0;
          padding: 0.4rem 1rem;
          background: #0b233f;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
          line-height: 1.3;
        }

        .card-body {
          flex: 1;
          padding: 1.5rem;
        }

        .date {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.875rem;
          font-weight: 700;
          color: rgba(11, 35, 63, 0.65);
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
