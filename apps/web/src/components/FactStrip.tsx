interface Fact {
  label: string;
  value: string;
}

interface FactStripProps {
  facts: Fact[];
}

export default function FactStrip({ facts }: FactStripProps) {
  return (
    <dl className="facts">
      {facts.map((fact) => (
        <div className="fact" key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}

      <style jsx>{`
        .facts {
          margin: 2.5rem auto 0;
          max-width: 800px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
        }

        .fact {
          text-align: center;
          min-width: 140px;
        }

        dt {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.875rem;
          font-weight: 700;
          color: rgba(11, 35, 63, 0.7);
        }

        dd {
          margin: 0.4rem 0 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: #0b233f;
        }
      `}</style>
    </dl>
  );
}
