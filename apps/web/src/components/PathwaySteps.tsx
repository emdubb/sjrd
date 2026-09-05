interface PathwayStep {
  name: string;
  tag: string;
  description: string;
}

interface PathwayStepsProps {
  steps: PathwayStep[];
}

export default function PathwaySteps({ steps }: PathwayStepsProps) {
  return (
    <ol className="pathway">
      {steps.map((step, index) => (
        <li key={step.name} className="step">
          <div className="step-card">
            <p className="tag">{step.tag}</p>
            <h3 className="name">{step.name}</h3>
            <p className="description">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <span className="arrow" aria-hidden="true">
              →
            </span>
          )}
        </li>
      ))}

      <style jsx>{`
        .pathway {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: center;
          gap: 1rem;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .step-card {
          background: #ffffff;
          color: #0b233f;
          border-radius: 16px;
          padding: 1.5rem;
          width: 220px;
          text-align: left;
          border: 1px solid rgba(11, 35, 63, 0.08);
          box-shadow: 0 10px 24px rgba(11, 35, 63, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .step-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 32px rgba(11, 35, 63, 0.2);
        }

        .tag {
          display: inline-block;
          margin: 0;
          padding: 0.2rem 0.6rem;
          background: #0b233f;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
          transform: rotate(-1.5deg);
        }

        .name {
          margin: 0.5rem 0;
          font-size: 1.3rem;
        }

        .description {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(11, 35, 63, 0.72);
        }

        .arrow {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f2bf35;
          color: #0b233f;
          font-weight: 700;
          font-size: 1.1rem;
        }

        @media (max-width: 900px) {
          .pathway {
            flex-direction: column;
          }

          .step {
            flex-direction: column;
          }

          .step-card {
            width: 100%;
            max-width: 360px;
          }

          .arrow {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </ol>
  );
}
