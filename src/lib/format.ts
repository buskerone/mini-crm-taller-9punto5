const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

// 1234567 → "$1.234.567"
export const formatCLP = (n: number) => clp.format(n);

// "2026-08-04" → "04-08-2026". Se corta el string ISO sin pasar por new Date(),
// que lo leería como medianoche UTC y en Chile lo correría al día anterior.
export function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}-${month}-${year}`;
}
