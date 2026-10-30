const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// "Sep 2022 — Jun 2025" → ["Sep 2022", "Jun 2025"]; an open period
// ("Jul 2025 — Present") keeps its end word.
export const periodEnds = (period) => period.split(/\s+[—–-]\s+/);

// "Jun 2024 — Aug 2024" → "2024"; "Sep 2022 — Jun 2025" → "2022–25".
export const yearRange = (period) => {
  const [from, to] = period.match(/\d{4}/g) ?? [];
  if (!from) return "";
  return !to || to === from ? from : `${from}–${to.slice(2)}`;
};

// "Jul 2025" → 2025.5. An end date covers its whole month (or year), so
// "Jul 2025 — Jul 2026" ends at the start of Aug 2026.
const toYear = (text, isEnd) => {
  const m = text?.match(/(?:([a-z]{3})[a-z]*\s+)?(\d{4})/i);
  if (!m) return null;
  const month = m[1] ? MONTHS.indexOf(m[1].toLowerCase()) : isEnd ? 11 : 0;
  return Number(m[2]) + (month + (isEnd ? 1 : 0)) / 12;
};

// Today as a fractional year, e.g. late Oct 2026 → 2026.83.
const yearNow = () => {
  const now = new Date();
  return now.getFullYear() + (now.getMonth() + 1) / 12;
};

// Period string → { start, end } as fractional years. An open end
// ("Jul 2025 — Present") runs until today.
const periodSpan = (period) => {
  const [from, to] = periodEnds(period);
  return {
    start: toYear(from, false),
    end: toYear(to ?? from, true) ?? yearNow(),
  };
};

// "Jun 2024 — Aug 2024" → "3 mos"; "Sep 2022 — Jun 2025" → "2 yrs 10 mos".
export const durationLabel = (period) => {
  const { start, end } = periodSpan(period);
  const months = Math.round((end - start) * 12);
  const unit = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  if (months < 12) return unit(months, "mo");
  const years = Math.floor(months / 12);
  return months % 12 ? `${unit(years, "yr")} ${unit(months % 12, "mo")}` : unit(years, "yr");
};
