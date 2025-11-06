export function monthKeyFromTimestamp(ts: number) {
  const d = new Date(ts);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function addMonthsToYearMonth(
  year: number,
  monthOneBased: number,
  add: number
) {
  const totalMonths = year * 12 + (monthOneBased - 1) + add;
  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;
  return { year: newYear, month: newMonth };
}
