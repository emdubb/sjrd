import ImagePlaceholder from './ImagePlaceholder';

interface TeamCardProps {
  name: string;
  tag: string;
  ageNote: string;
  description: string;
}

export default function TeamCard({ name, tag, ageNote, description }: TeamCardProps) {
  return (
    <article className="card">
      <ImagePlaceholder label={`${name} team photo placeholder`} aspectRatio="4 / 3" />
      <p className="tag">{tag}</p>
      <h2 className="name">{name}</h2>
      <p className="age-note">{ageNote}</p>
      <p className="description">{description}</p>

      <style jsx>{`
        .card {
          background: #1f3a5b;
          color: #ffffff;
          border-radius: 20px;
          padding: 1.5rem;
          text-align: left;
        }

        .tag {
          margin: 1.25rem 0 0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.875rem;
          font-weight: 700;
          color: #f2bf35;
        }

        .name {
          margin: 0.5rem 0;
          font-size: 1.6rem;
        }

        .age-note {
          margin: 0 0 0.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #b9c2cc;
        }

        .description {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: #ffffff;
        }
      `}</style>
    </article>
  );
}
