export default function TestimonialPlaceholder() {
  return (
    <figure className="card">
      <p className="flag">Placeholder — swap in a real quote</p>
      <blockquote>“Add a quote from a Beastie Bears parent or skater about their experience here.”</blockquote>
      <figcaption>— Placeholder, Beastie Bears Family</figcaption>

      <style jsx>{`
        .card {
          margin: 0;
          background: #1f3a5b;
          color: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          text-align: left;
          position: relative;
        }

        .flag {
          display: inline-block;
          margin: 0 0 1rem;
          padding: 0.2rem 0.6rem;
          border: 1px dashed #b9c2cc;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #b9c2cc;
        }

        blockquote {
          margin: 0;
          font-size: 1.35rem;
          line-height: 1.6;
          font-style: italic;
        }

        figcaption {
          margin-top: 1.25rem;
          color: #f2bf35;
          font-weight: 700;
          font-size: 0.95rem;
        }
      `}</style>
    </figure>
  );
}
