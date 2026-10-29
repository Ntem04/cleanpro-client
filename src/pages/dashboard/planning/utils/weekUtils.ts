export interface WeekOption {
  readonly offset: number;
  readonly label: string;
  readonly shortLabel: string;
  readonly dateRange: string;
  readonly group: "past" | "current" | "future";
}

/**
 * Calcule le lundi de la semaine en cours.
 */
function getMondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  // En JS: 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Formate une option de semaine avec libellé en français.
 */
export function formatWeekOption(offset: number): WeekOption {
  const monday = getMondayOfCurrentWeek();
  monday.setDate(monday.getDate() + offset * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startDay = monday.getDate();
  const endDay = sunday.getDate();

  const startMonth = monday.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
  const endMonth = sunday.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
  const year = sunday.getFullYear();

  const sameMonth = monday.getMonth() === sunday.getMonth();
  const dateRange = sameMonth
    ? `${startDay} – ${endDay} ${endMonth} ${year}`
    : `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;

  if (offset === 0) {
    return {
      offset: 0,
      label: `Semaine en cours (${dateRange})`,
      shortLabel: "Semaine en cours",
      dateRange,
      group: "current",
    };
  }

  if (offset === -1) {
    return {
      offset: -1,
      label: `Semaine passée (${dateRange})`,
      shortLabel: "Semaine passée",
      dateRange,
      group: "past",
    };
  }

  if (offset < -1) {
    const sDiff = Math.abs(offset);
    const suffix = offset <= -4 ? " · Archive" : "";
    return {
      offset,
      label: `Semaine du ${dateRange} (S-${sDiff}${suffix})`,
      shortLabel: `Semaine S-${sDiff}`,
      dateRange,
      group: "past",
    };
  }

  if (offset === 1) {
    return {
      offset: 1,
      label: `Semaine prochaine (${dateRange})`,
      shortLabel: "Semaine prochaine",
      dateRange,
      group: "future",
    };
  }

  return {
    offset,
    label: `Semaine du ${dateRange} (S+${offset})`,
    shortLabel: `Semaine S+${offset}`,
    dateRange,
    group: "future",
  };
}

/**
 * Liste complète et détaillée des options de semaines.
 * Couvre largement les anciennes semaines antérieures à la semaine en cours (jusqu'à 8 semaines passées),
 * la semaine en cours, et les semaines à venir.
 */
export function getAvailableWeekOptions(): readonly WeekOption[] {
  // Anciennes semaines (de -8 à -1)
  const pastOffsets = [-8, -7, -6, -5, -4, -3, -2, -1];
  const currentOffset = [0];
  const futureOffsets = [1, 2, 3, 4];

  return [...pastOffsets, ...currentOffset, ...futureOffsets].map(formatWeekOption);
}

