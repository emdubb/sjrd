function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function eachDateInRange(startIso: string, endIso: string): string[] {
  const cur = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const dates: string[] = [];
  while (cur <= end) {
    dates.push(formatIsoDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}
