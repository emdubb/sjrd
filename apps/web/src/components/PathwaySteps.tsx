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
          background: #1f3a5b;
          color: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          width: 220px;
          text-align: left;
        }

        .tag {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.875rem;
          font-weight: 700;
          color: #f2bf35;
        }

        .name {
          margin: 0.5rem 0;
          font-size: 1.3rem;
        }

        .description {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #b9c2cc;
        }

        .arrow {
          font-size: 1.5rem;
          color: #0b233f;
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
