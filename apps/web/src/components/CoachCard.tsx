import ImagePlaceholder from './ImagePlaceholder';

interface CoachCardProps {
  displayName: string;
  legalName: string;
  pronouns: string;
  role: string;
  bio?: string;
}

export default function CoachCard({ displayName, legalName, pronouns, role, bio }: CoachCardProps) {
  return (
    <article className="card">
      <div className="media">
        <ImagePlaceholder label={`${displayName} headshot placeholder`} aspectRatio="1 / 1" />
        <span className="tag">{role}</span>
      </div>
      <h3 className="name">{displayName}</h3>
      <p className="meta">
        {legalName} ({pronouns})
      </p>
      {bio ? <p className="bio">{bio}</p> : <p className="bio bio-pending">Bio coming soon.</p>}

      <style jsx>{`
        .card {
          background: #ffffff;
          color: #0b233f;
          border-radius: 20px;
          padding: 1.5rem;
          text-align: left;
          border: 1px solid rgba(11, 35, 63, 0.08);
          box-shadow: 0 10px 24px rgba(11, 35, 63, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 32px rgba(11, 35, 63, 0.2);
        }

        .media {
          position: relative;
          margin-bottom: 1.75rem;
          max-width: 200px;
          margin-left: auto;
          margin-right: auto;
        }

        .tag {
          position: absolute;
          left: 50%;
          bottom: -1rem;
          transform: translateX(-50%);
          display: inline-block;
          width: max-content;
          max-width: calc(100% - 1rem);
          padding: 0.4rem 0.9rem;
          background: #0b233f;
          color: #ffffff;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.875rem;
          font-weight: 700;
          text-align: center;
          box-shadow: 0 6px 14px rgba(11, 35, 63, 0.3);
          transition: background 0.2s ease, color 0.2s ease;
        }

        .card:hover .tag {
          background: #f2bf35;
          color: #0b233f;
        }

        .name {
          margin: 0.25rem 0;
          font-size: 1.4rem;
          text-align: center;
        }

        .meta {
          margin: 0 0 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(11, 35, 63, 0.65);
          text-align: center;
        }

        .bio {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(11, 35, 63, 0.85);
          text-align: center;
        }

        .bio-pending {
          font-style: italic;
          color: rgba(11, 35, 63, 0.65);
        }
      `}</style>
    </article>
  );
}
