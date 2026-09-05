import ImagePlaceholder from './ImagePlaceholder';

interface CoachCardProps {
  name: string;
  role: string;
  bio: string;
}

export default function CoachCard({ name, role, bio }: CoachCardProps) {
  return (
    <article className="card">
      <div className="media">
        <ImagePlaceholder label={`${name} headshot placeholder`} aspectRatio="1 / 1" />
        <span className="tag">{role}</span>
      </div>
      <h3 className="name">{name}</h3>
      <p className="bio">{bio}</p>

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
          padding: 0.4rem 0.9rem;
          background: #0b233f;
          color: #ffffff;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.875rem;
          font-weight: 700;
          white-space: nowrap;
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

        .bio {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(11, 35, 63, 0.85);
          text-align: center;
        }
      `}</style>
    </article>
  );
}
