interface ScheduleRow {
  day: string;
  time: string;
  team: string;
}

interface ScheduleTableProps {
  rows: ScheduleRow[];
}

export default function ScheduleTable({ rows }: ScheduleTableProps) {
  return (
    <table className="schedule">
      <caption className="caption">Weekly Practice Schedule</caption>
      <thead>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Time</th>
          <th scope="col">Team</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.day}-${row.time}`}>
            <td>{row.day}</td>
            <td>{row.time}</td>
            <td>{row.team}</td>
          </tr>
        ))}
      </tbody>

      <style jsx>{`
        .schedule {
          width: 100%;
          max-width: 640px;
          margin: 2rem auto 0;
          border-collapse: collapse;
          text-align: left;
        }

        .caption {
          text-align: left;
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
          color: #0b233f;
        }

        th,
        td {
          padding: 0.85rem 1rem;
          font-size: 1rem;
          border-bottom: 1px solid rgba(11, 35, 63, 0.12);
        }

        th {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.875rem;
          color: #0b233f;
        }

        td {
          color: rgba(11, 35, 63, 0.85);
        }
      `}</style>
    </table>
  );
}
